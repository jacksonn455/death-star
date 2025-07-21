require("./newrelic-init.js");

require("dotenv").config();
const express = require("express");
const rotaPacientes = require("./routes/pacientes");
const rotaAgendamento = require("./routes/planner");
const rotaProdutos = require("./routes/products");
const rotaVendas = require("./routes/sales");
const rotaAuth = require("./routes/auth");
const rotaHealth = require("./routes/health");
const cors = require("cors");
const dbConnect = require("./config/dbConnect.js");
const { authMiddleware } = require("./middlewares/auth");
const errorMiddleware = require("./middlewares/error");
const { newRelicMiddleware } = require("./middlewares/newrelic");
const { initializeServicesService } = require("./services/sales");

const app = express();

const allowedOrigins = [
  "https://jacksonmagnabosco.dev",
  "https://death-star.onrender.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`🚫 Acesso bloqueado por CORS: ${origin}`);
        callback(new Error("Acesso não permitido por CORS."));
      }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(newRelicMiddleware);

const port = process.env.PORT || 8000;

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ Erro: MONGO_URI não está configurado.");
    process.exit(1);
  }

  try {
    await dbConnect();
    console.log("✅ Banco de dados conectado!");

    // Inicializar serviços
    try {
      await initializeServicesService();
    } catch (error) {
      console.error("⚠️ Erro ao inicializar serviços:", error.message);
    }

    app.use((req, res, next) => {
      const timeout = 8000;
      const timer = setTimeout(() => {
        console.error("⏳ Tempo limite atingido para", req.originalUrl);
        res.status(504).json({ error: "Tempo limite da requisição atingido." });
      }, timeout);

      res.on("finish", () => clearTimeout(timer));
      res.on("close", () => clearTimeout(timer));
      next();
    });

    app.use("/health", rotaHealth);
    app.use("/pacientes", authMiddleware, rotaPacientes);
    app.use("/agenda", authMiddleware, rotaAgendamento);
    app.use("/produtos", authMiddleware, rotaProdutos);
    app.use("/vendas", authMiddleware, rotaVendas);
    app.use("/auth", rotaAuth);

    app.use(errorMiddleware);

    const apiRoutes = [
      "/pacientes",
      "/agenda",
      "/produtos",
      "/vendas",
      "/auth",
      "/health",
    ];

    app.get("*", (req, res) => {
      if (!apiRoutes.some((route) => req.path.startsWith(route))) {
        return res.redirect(
          `https://jacksonmagnabosco.dev/millennium-falcon${req.path}`
        );
      }
      res.status(404).json({ error: "Rota não encontrada." });
    });

    app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
      console.log(`📊 New Relic monitoramento ativo`);
    });
  } catch (error) {
    console.error("❌ Falha ao iniciar o servidor:", error.message);
    process.exit(1);
  }
};

startServer();
