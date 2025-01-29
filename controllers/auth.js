const { login, register } = require("../services/auth");

async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }

    const token = await login({ email, password });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });
  }
}

async function registerController(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const response = await register({ name, email, password, role });

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { loginController, registerController };