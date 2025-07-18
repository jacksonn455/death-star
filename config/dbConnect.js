const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

async function defaultConnect() {
  try {
    const connection = await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });

    mongoose.set("debug", false);
    mongoose.set("strictQuery", false);
    return connection;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error.message);
    throw error;
  }
}

module.exports = defaultConnect;
