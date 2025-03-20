const { refreshToken } = require("../services/auth");
const jwt = require("jsonwebtoken");

async function refreshTokenController(req, res, next) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      console.error("[ERROR] Refresh token não enviado.");
      throw new Error("Refresh token é obrigatório.");
    }

    const tokens = await refreshToken(token);

    const decoded = jwt.decode(tokens.refreshToken);

    if (decoded && decoded.exp) {
    } else {
      console.warn(
        "[WARNING] Não foi possível decodificar o refresh token gerado."
      );
    }

    res.status(200).json(tokens);
  } catch (error) {
    console.error("[ERROR] Erro ao gerar refresh token:", error.message);
    next(error);
  }
}

module.exports = { refreshTokenController };
