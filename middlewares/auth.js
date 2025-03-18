const {
  verify,
  TokenExpiredError,
  JsonWebTokenError,
} = require("jsonwebtoken");

const jsonSecret = process.env.JSON_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token não fornecido ou mal formatado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, jsonSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expirado" });
    } else if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ message: "Token inválido" });
    }
    return res.status(500).json({ message: "Erro interno ao validar token" });
  }
}

module.exports = { authMiddleware };
