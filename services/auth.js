const { User } = require("../models/users");
const { compare, hash } = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../utils/jwt");
const { validateRequiredFields } = require("../utils/validationUtils");

async function login(dto) {
  const { email, password } = dto;

  validateRequiredFields({ email, password }, ["email", "password"]);

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Credenciais inválidas");
  }

  const accessToken = generateToken({ email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ email: user.email });

  await User.findOneAndUpdate(
    { email: user.email },
    { $push: { refreshTokens: refreshToken } }
  );

  return { accessToken, refreshToken };
}

async function refreshToken(token) {
  const user = await User.findOne({ refreshTokens: token });

  if (!user) {
    throw new Error("Refresh token inválido.");
  }

  const accessToken = generateToken({ email: user.email, role: user.role });
  const newRefreshToken = generateRefreshToken({ email: user.email });

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
  const user = await User.findOne({ refreshTokens: token });

  if (!user) {
    console.warn("Tentativa de logout com um refresh token inválido.");
    return;
  }

  await User.findOneAndUpdate(
    { refreshTokens: token },
    { $pull: { refreshTokens: token } }
  );
}

module.exports = {
  login,
  refreshToken,
  register,
  logout,
};
