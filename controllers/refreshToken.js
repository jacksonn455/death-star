const { refreshToken } = require("../services/auth");
const { verifyRefreshToken } = require("../utils/jwt");

async function refreshTokenController(req, res, next) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      console.error("[ERROR] Refresh token não enviado.");
      return res.status(400).json({ error: "Refresh token é obrigatório." });
    }

    // Validar o refresh token antes de processar
    try {
      const decoded = verifyRefreshToken(token);
      console.log("[INFO] Refresh token válido para usuário:", decoded.email);
    } catch (jwtError) {
      console.error("[ERROR] Refresh token inválido ou expirado:", jwtError.message);
      return res.status(401).json({ error: "Refresh token inválido ou expirado." });
    }

    const tokens = await refreshToken(token);

    // Verificar se o novo refresh token foi gerado corretamente
    try {
      const newDecoded = verifyRefreshToken(tokens.refreshToken);
      if (!newDecoded || !newDecoded.exp) {
        console.warn("[WARNING] Não foi possível validar o novo refresh token gerado.");
      }
    } catch (verifyError) {
      console.error("[ERROR] Erro ao validar novo refresh token:", verifyError.message);
      return res.status(500).json({ error: "Erro interno ao gerar tokens." });
    }

    res.status(200).json(tokens);
  } catch (error) {
    console.error("[ERROR] Erro ao gerar refresh token:", error.message);
    next(error);
  }
}

module.exports = { refreshTokenController };
