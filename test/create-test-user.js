<<<<<<< HEAD
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000';

async function createTestUser() {
  console.log('🔧 Criando usuário de teste...\n');

  try {
    // Criar usuário de teste
    console.log('1️⃣ Registrando usuário de teste...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: "Usuário Teste",
      email: "test@example.com",
      password: "test123",
      role: "admin"
    });
    
    console.log('✅ Usuário de teste criado com sucesso');
    console.log('   - Email: test@example.com');
    console.log('   - Senha: test123');

    // Testar login
    console.log('\n2️⃣ Testando login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: "test@example.com",
      password: "test123"
    });
    
    const { accessToken } = loginResponse.data;
    console.log('✅ Login realizado com sucesso');
    console.log('   - Token obtido:', accessToken ? 'Sim' : 'Não');

    console.log('\n🎉 Usuário de teste configurado com sucesso!');

  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️ Usuário de teste já existe, testando login...');
      
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: "test@example.com",
          password: "test123"
        });
        
        const { accessToken } = loginResponse.data;
        console.log('✅ Login realizado com sucesso');
        console.log('   - Token obtido:', accessToken ? 'Sim' : 'Não');
        console.log('\n🎉 Usuário de teste já está configurado!');
      } catch (loginError) {
        console.error('❌ Erro no login:', loginError.response?.data || loginError.message);
        process.exit(1);
      }
    } else {
      console.error('❌ Erro ao criar usuário de teste:');
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.message);
      process.exit(1);
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createTestUser();
}

module.exports = { createTestUser }; 
=======
const axios = require("axios");
const { hash } = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Script para criar um usuário de teste
 * Este script deve ser executado uma vez para configurar o ambiente de teste
 */
class TestUserCreator {
  constructor() {
    this.baseURL = "http://localhost:8000";
    this.testUser = {
      name: "Test User",
      email: "admin@test.com",
      password: "admin123",
      role: "admin"
    };
  }

  /**
   * Conectar ao banco de dados
   */
  async connectToDatabase() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Conectado ao banco de dados");
      return true;
    } catch (error) {
      console.error("❌ Erro ao conectar ao banco:", error.message);
      return false;
    }
  }

  /**
   * Verificar se o usuário já existe
   */
  async checkUserExists() {
    try {
      const { User } = require("../models/users");
      const existingUser = await User.findOne({ email: this.testUser.email });
      return existingUser;
    } catch (error) {
      console.error("❌ Erro ao verificar usuário:", error.message);
      return null;
    }
  }

  /**
   * Criar usuário de teste
   */
  async createTestUser() {
    try {
      const { User } = require("../models/users");
      
      // Verificar se já existe
      const existingUser = await this.checkUserExists();
      if (existingUser) {
        console.log("✅ Usuário de teste já existe");
        return existingUser;
      }

      // Hash da senha
      const hashedPassword = await hash(this.testUser.password, 10);

      // Criar usuário
      const newUser = new User({
        name: this.testUser.name,
        email: this.testUser.email,
        password: hashedPassword,
        role: this.testUser.role,
        refreshTokens: []
      });

      await newUser.save();
      console.log("✅ Usuário de teste criado com sucesso");
      return newUser;
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error.message);
      return null;
    }
  }

  /**
   * Testar login com o usuário criado
   */
  async testLogin() {
    try {
      const loginData = {
        email: this.testUser.email,
        password: this.testUser.password
      };

      const response = await axios.post(`${this.baseURL}/auth/login`, loginData);
      
      if (response.status === 200 && response.data.accessToken) {
        console.log("✅ Login de teste funcionando");
        console.log(`📝 Token obtido: ${response.data.accessToken.substring(0, 20)}...`);
        return true;
      } else {
        console.log("❌ Login de teste falhou");
        return false;
      }
    } catch (error) {
      console.error("❌ Erro no teste de login:", error.message);
      return false;
    }
  }

  /**
   * Executar criação do usuário de teste
   */
  async run() {
    console.log("🚀 Criando usuário de teste...\n");

    // Conectar ao banco
    const isConnected = await this.connectToDatabase();
    if (!isConnected) {
      console.log("❌ Não foi possível conectar ao banco. Abortando.");
      return;
    }

    // Criar usuário
    const user = await this.createTestUser();
    if (!user) {
      console.log("❌ Não foi possível criar usuário. Abortando.");
      return;
    }

    // Testar login
    const loginWorks = await this.testLogin();
    if (!loginWorks) {
      console.log("❌ Login não está funcionando. Verifique o servidor.");
      return;
    }

    console.log("\n🎉 Usuário de teste configurado com sucesso!");
    console.log("📧 Email:", this.testUser.email);
    console.log("🔑 Senha:", this.testUser.password);
    console.log("👤 Role:", this.testUser.role);
    console.log("\n💡 Agora você pode executar os testes de agendamento:");
    console.log("   npm run test:planner-auth");

    // Fechar conexão
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  const creator = new TestUserCreator();
  creator.run().catch(console.error);
}

module.exports = TestUserCreator; 
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
