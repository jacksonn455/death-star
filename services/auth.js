const { User } = require("../models/users");
const { compare, hash } = require("bcryptjs");
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
const { validateRequiredFields } = require("../utils/validationUtils");

async function login(dto) {
  const { email, password } = dto;

  validateRequiredFields({ email, password }, ["email", "password"]);

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Credenciais inválidas");
  }

  const accessToken = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    id: user._id,
    email: user.email,
  });

  await User.updateOne(
    { email: user.email },
    { $push: { refreshTokens: refreshToken } }
  );

  return { accessToken, refreshToken };
}

async function refreshToken(token) {
  if (!token) {
    throw new Error("Refresh token é obrigatório.");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token expirado.");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Refresh token inválido.");
    } else {
      throw new Error("Erro ao validar refresh token.");
    }
  }

  const user = await User.findOne({
    email: decoded.email,
    refreshTokens: token,
  });

  if (!user) {
    throw new Error("Refresh token inválido ou não encontrado.");
  }

  const accessToken = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = generateRefreshToken({
    id: user._id,
    email: user.email,
  });

  await User.updateOne({ _id: user._id }, { $pull: { refreshTokens: token } });

  await User.updateOne(
    { _id: user._id },
    { $push: { refreshTokens: newRefreshToken } }
  );

  return { accessToken, refreshToken: newRefreshToken };
}

async function register(dto) {
  const { name, email, password, role } = dto;

  validateRequiredFields({ name, email, password, role }, [
    "name",
    "email",
    "password",
    "role",
  ]);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email já está em uso");
  }

  const hashedPassword = await hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
    refreshTokens: [],
  });

  await newUser.save();

  return { message: "Usuário criado com sucesso!" };
}

async function logout(token) {
  if (!token) {
    throw new Error("Refresh token é obrigatório para logout.");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (error) {
    console.warn(
      "[WARNING] Tentativa de logout com refresh token inválido:",
      error.message
    );
  }

  const result = await User.updateOne(
    { refreshTokens: token },
    { $pull: { refreshTokens: token } }
  );

  if (result.matchedCount === 0) {
    console.warn(
      "[WARNING] Tentativa de logout com um refresh token não encontrado."
    );
  } else {
    console.log(
      "[INFO] Logout realizado com sucesso para usuário:",
      decoded?.email || "desconhecido"
    );
  }
}

module.exports = {
  login,
  refreshToken,
  register,
  logout,
};
