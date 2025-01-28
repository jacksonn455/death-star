require('dotenv').config();
const express = require("express");
const rotaPacientes = require("./routes/pacientes");
const rotaAgendamento = require("./routes/planner");
const cors = require("cors");
const dbConnect = require("./config/dbConnect.js");

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://jacksonmagnabosco.dev/millennium-falcon',
}));

const port = process.env.PORT || 8000;

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error("Erro: MONGO_URI não está configurado.");
    process.exit(1);
  }

  try {
    await dbConnect();
    app.use("/pacientes", rotaPacientes);
    app.use("/agenda", rotaAgendamento);

    app.listen(port, () => {
      console.log(`Servidor ouvindo na porta ${port}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error.message);
    process.exit(1);
  }
};

startServer();