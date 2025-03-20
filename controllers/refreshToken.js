const { refreshToken } = require("../services/auth");

async function refreshTokenController(req, res, next) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new Error("Refresh token é obrigatório.");
    }

    const tokens = await refreshToken(token);
    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
}

module.exports = { refreshTokenController };
