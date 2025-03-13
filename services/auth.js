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

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
}

async function refreshToken(token) {
  const user = await User.findOne({ refreshToken: token });

  if (!user) {
    throw new Error("Refresh token inválido.");
  }

  const accessToken = generateToken({ email: user.email, role: user.role });

  return accessToken;
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
  });

  await newUser.save();

  return { message: "Usuário criado com sucesso!" };
}

module.exports = {
  login,
  refreshToken,
  register,
};
