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