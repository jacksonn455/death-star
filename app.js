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

const port = 8000;

const startServer = async () => {
  try {
    const connection = await dbConnect();
    connection.on("error", console.error.bind(console, "connection error:"));
    connection.once("open", () => {
      console.log("Conectado ao banco de dados");
    });

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