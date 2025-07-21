const mongoose = require("mongoose");
require("dotenv").config();

async function removeEmailIndex() {
  console.log("🔧 Removendo índice único do campo email...\n");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado ao banco de dados");

    const db = mongoose.connection.db;
    const collection = db.collection("pacientes");

    console.log("📋 Índices existentes:");
    const indexes = await collection.indexes();
    indexes.forEach((index) => {
      console.log("   -", index.name, ":", JSON.stringify(index.key));
    });

    try {
      await collection.dropIndex("email_1");
      console.log("✅ Índice único do email removido com sucesso");
    } catch (error) {
      if (error.code === 27) {
        console.log("ℹ️ Índice único do email não existe");
      } else {
        console.error("❌ Erro ao remover índice:", error.message);
      }
    }

    console.log("\n📋 Índices após remoção:");
    const indexesAfter = await collection.indexes();
    indexesAfter.forEach((index) => {
      console.log("   -", index.name, ":", JSON.stringify(index.key));
    });

    console.log("\n🎉 Processo concluído!");
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  removeEmailIndex();
}

module.exports = { removeEmailIndex };
