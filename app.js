require("dotenv").config();
const express = require("express");
const rotaPacientes = require("./routes/pacientes");
const rotaAgendamento = require("./routes/planner");
const rotaProdutos = require("./routes/products");
const rotaAuth = require("./routes/auth");
const cors = require("cors");
const dbConnect = require("./config/dbConnect.js");
const { authMiddleware } = require("./middlewares/auth");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://jacksonmagnabosco.dev",
  "https://death-star.onrender.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS não permitido para esta origem."));
      }
    },
  })
);

const port = process.env.PORT || 8000;

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error("Erro: MONGO_URI não está configurado.");
    process.exit(1);
  }

  try {
    await dbConnect();
    app.use("/pacientes", authMiddleware, rotaPacientes);
    app.use("/agenda", authMiddleware, rotaAgendamento);
    app.post("/produtos", upload, async (req, res) => {
      try {
        const productData = req.body;
        if (req.file) {
          productData.image = req.file;
        }
        const newProduct = await createProductService(productData);
        res.status(201).json(newProduct);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    app.use("/auth", rotaAuth);

    app.listen(port, () => {
      console.log(`Servidor ouvindo na porta ${port}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error.message);
    process.exit(1);
  }
};

startServer();
