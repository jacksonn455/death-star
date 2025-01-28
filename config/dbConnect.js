const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

async function defaultConnect() {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log("Conectado ao banco de dados");
    return connection;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
    throw error;
  }
}

module.exports = defaultConnect;
