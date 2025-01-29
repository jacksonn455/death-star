const { User } = require("../models/users");
const { compare, hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const jsonSecret = process.env.JSON_SECRET;

async function login(dto) {
  const { email, password } = dto;

  if (!email || !password) {
    throw new Error("Email e senha são obrigatórios");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Credenciais inválidas");
  }

  const accessToken = sign({ email: user.email, role: user.role }, jsonSecret, {
    expiresIn: "1h",
  });

  return accessToken;
}

async function register(dto) {
  const { name, email, password, role } = dto;

  if (!name || !email || !password || !role) {
    throw new Error("Todos os campos são obrigatórios");
  }

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
  register,
};
