const {
  verify,
  TokenExpiredError,
  JsonWebTokenError,
} = require("jsonwebtoken");
const { User } = require("../models/users");

const jsonSecret = process.env.JSON_SECRET;

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token não fornecido ou mal formatado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, jsonSecret);

    if (!decoded.id && decoded.email) {
      const user = await User.findOne({ email: decoded.email });
      if (user) {
        decoded.id = user._id;
      } else {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Erro na autenticação:", error.message);
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expirado" });
    } else if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ message: "Token inválido" });
    }
    return res.status(500).json({ message: "Erro interno ao validar token" });
  }
}

module.exports = { authMiddleware };
