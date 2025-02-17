require('dotenv').config();
const express = require("express");
const rotaPacientes = require("./routes/pacientes");
const rotaAgendamento = require("./routes/planner");
const rotaProdutos = require("./routes/products");
const rotaAuth = require("./routes/auth");
const cors = require("cors");
const dbConnect = require("./config/dbConnect.js");
const { authMiddleware } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const allowedOrigins = [
  'https://jacksonmagnabosco.dev',
  'https://death-star.onrender.com',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Bloqueado por CORS: ${origin}`);
      callback(new Error("CORS não permitido para esta origem."));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}));

const port = process.env.PORT || 8000;

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ Erro: MONGO_URI não está configurado.");
    process.exit(1);
  }

  try {
    await dbConnect();
    console.log("✅ Banco de dados conectado!");
    app.use((req, res, next) => {
      res.setTimeout(15000, () => {
        console.error("⏳ Tempo limite atingido para", req.originalUrl);
        res.status(504).json({ error: "Tempo limite da requisição atingido." });
      });
      next();
    });

    app.use("/pacientes", authMiddleware, rotaPacientes);
    app.use("/agenda", authMiddleware, rotaAgendamento);
    app.use("/produtos", authMiddleware, rotaProdutos);
    app.use("/auth", rotaAuth);

    app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
    });

  } catch (error) {
    console.error("❌ Falha ao iniciar o servidor:", error.message);
    process.exit(1);
  }
};

startServer();