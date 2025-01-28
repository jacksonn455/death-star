const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

async function defaultConnect() {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    return mongoose.connection;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
    throw error;
  }
}

module.exports = defaultConnect;
