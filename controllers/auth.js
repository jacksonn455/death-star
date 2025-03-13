const { login, register } = require("../services/auth");
const { validateRequiredFields } = require("../utils/validationUtils");

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    validateRequiredFields({ email, password }, ["email", "password"]);

    const { accessToken, refreshToken } = await login({ email, password });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
}

async function registerController(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    validateRequiredFields({ name, email, password, role }, [
      "name",
      "email",
      "password",
      "role",
    ]);

    const response = await register({ name, email, password, role });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = { loginController, registerController };
