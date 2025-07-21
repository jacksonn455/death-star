require('dotenv').config();
const mongoose = require('mongoose');
const { hash } = require('bcryptjs');
const { User } = require('../models/users');

const { MONGO_URI } = process.env;

async function createTestUser() {
  try {
    console.log('🔗 Conectando ao MongoDB...');
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log('✅ Conectado ao MongoDB');

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('✅ Usuário de teste já existe');
      console.log('   Email: test@example.com');
      console.log('   Senha: test123');
      return;
    }

    // Criar usuário de teste
    const hashedPassword = await hash('test123', 10);
    
    const testUser = new User({
      name: 'Usuário Teste',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await testUser.save();
    
    console.log('✅ Usuário de teste criado com sucesso!');
    console.log('   Email: test@example.com');
    console.log('   Senha: test123');
    console.log('   Role: admin');

  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  }
}

if (require.main === module) {
  createTestUser();
}

module.exports = { createTestUser };
