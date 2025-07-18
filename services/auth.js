const { User } = require("../models/users");
const { compare, hash } = require("bcryptjs");
<<<<<<< HEAD
const {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");
=======
const { generateToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
const { validateRequiredFields } = require("../utils/validationUtils");

async function login(dto) {
  const { email, password } = dto;

  validateRequiredFields({ email, password }, ["email", "password"]);

<<<<<<< HEAD
  const user = await User.findOne({ email }).select("+password");
=======
  const user = await User.findOne({ email }).select('+password');
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71

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

<<<<<<< HEAD
=======
  // Validar o refresh token
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (error) {
<<<<<<< HEAD
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token expirado.");
    } else if (error.name === "JsonWebTokenError") {
=======
    if (error.name === 'TokenExpiredError') {
      throw new Error("Refresh token expirado.");
    } else if (error.name === 'JsonWebTokenError') {
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
      throw new Error("Refresh token inválido.");
    } else {
      throw new Error("Erro ao validar refresh token.");
    }
  }

<<<<<<< HEAD
  const user = await User.findOne({
    email: decoded.email,
    refreshTokens: token,
=======
  // Buscar usuário pelo email do token e verificar se o token está na lista
  const user = await User.findOne({ 
    email: decoded.email,
    refreshTokens: token 
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
  });

  if (!user) {
    throw new Error("Refresh token inválido ou não encontrado.");
  }

<<<<<<< HEAD
  const accessToken = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = generateRefreshToken({
    id: user._id,
    email: user.email,
  });
=======
  // Gerar novos tokens
  const accessToken = generateToken({ email: user.email, role: user.role });
  const newRefreshToken = generateRefreshToken({ email: user.email });
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71

  // Atualizar a lista de refresh tokens (primeiro remover o antigo, depois adicionar o novo)
  await User.updateOne(
    { _id: user._id },
    { $pull: { refreshTokens: token } }
  );

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

<<<<<<< HEAD
=======
  // Validar o refresh token
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (error) {
<<<<<<< HEAD
    console.warn(
      "[WARNING] Tentativa de logout com refresh token inválido:",
      error.message
    );
  }

=======
    // Para logout, não vamos rejeitar tokens inválidos, apenas logar
    console.warn("[WARNING] Tentativa de logout com refresh token inválido:", error.message);
  }

  // Remover o token da lista do usuário
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
  const result = await User.updateOne(
    { refreshTokens: token },
    { $pull: { refreshTokens: token } }
  );

  if (result.matchedCount === 0) {
<<<<<<< HEAD
    console.warn(
      "[WARNING] Tentativa de logout com um refresh token não encontrado."
    );
  } else {
    console.log(
      "[INFO] Logout realizado com sucesso para usuário:",
      decoded?.email || "desconhecido"
    );
=======
    console.warn("[WARNING] Tentativa de logout com um refresh token não encontrado.");
  } else {
    console.log("[INFO] Logout realizado com sucesso para usuário:", decoded?.email || "desconhecido");
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
  }
}

module.exports = {
  login,
  refreshToken,
  register,
  logout,
};
