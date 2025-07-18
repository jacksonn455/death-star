const mongoose = require('mongoose');
require('dotenv').config();

async function removeEmailIndex() {
  console.log('🔧 Removendo índice único do campo email...\n');

  try {
    // Conectar ao banco de dados
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado ao banco de dados');

    // Obter a coleção de pacientes
    const db = mongoose.connection.db;
    const collection = db.collection('pacientes');

    // Listar índices existentes
    console.log('📋 Índices existentes:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log('   -', index.name, ':', JSON.stringify(index.key));
    });

    // Remover índice único do email se existir
    try {
      await collection.dropIndex('email_1');
      console.log('✅ Índice único do email removido com sucesso');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️ Índice único do email não existe');
      } else {
        console.error('❌ Erro ao remover índice:', error.message);
      }
    }

    // Verificar índices após remoção
    console.log('\n📋 Índices após remoção:');
    const indexesAfter = await collection.indexes();
    indexesAfter.forEach(index => {
      console.log('   -', index.name, ':', JSON.stringify(index.key));
    });

    console.log('\n🎉 Processo concluído!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  removeEmailIndex();
}

module.exports = { removeEmailIndex }; 