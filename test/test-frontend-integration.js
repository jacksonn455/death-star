const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const TEST_EMAIL = 'admin@test.com';
const TEST_PASSWORD = 'admin123';

async function testFrontendIntegration() {
  console.log('🧪 Testando integração Frontend-Backend...\n');

  try {
    // 1. Simular login do frontend
    console.log('1️⃣ Simulando login do frontend...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    const { accessToken, refreshToken } = loginResponse.data;
    console.log('✅ Login realizado com sucesso');
    console.log(`📝 Access Token: ${accessToken.substring(0, 20)}...`);
    console.log(`🔄 Refresh Token: ${refreshToken.substring(0, 20)}...\n`);

    // 2. Simular requisição autenticada (como o frontend faria)
    console.log('2️⃣ Testando requisição autenticada...');
    const authResponse = await axios.get(`${BASE_URL}/pacientes`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Requisição autenticada funcionou\n');

    // 3. Simular token expirado (como o interceptor do frontend faria)
    console.log('3️⃣ Simulando token expirado...');
    try {
      await axios.get(`${BASE_URL}/pacientes`, {
        headers: {
          'Authorization': 'Bearer expired_token_here'
        }
      });
      console.log('❌ Erro: Deveria ter rejeitado token expirado');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Token expirado rejeitado corretamente');
      } else {
        console.log('❌ Erro inesperado:', error.response?.data || error.message);
      }
    }

    // 4. Simular refresh automático (como o interceptor faria)
    console.log('\n4️⃣ Simulando refresh automático...');
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken: refreshToken
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
    console.log('✅ Refresh automático funcionou');
    console.log(`📝 Novo Access Token: ${newAccessToken.substring(0, 20)}...`);
    console.log(`🔄 Novo Refresh Token: ${newRefreshToken.substring(0, 20)}...\n`);

    // 5. Testar nova requisição com token renovado
    console.log('5️⃣ Testando requisição com token renovado...');
    const newAuthResponse = await axios.get(`${BASE_URL}/pacientes`, {
      headers: {
        'Authorization': `Bearer ${newAccessToken}`
      }
    });
    console.log('✅ Requisição com token renovado funcionou\n');

    // 6. Simular logout do frontend
    console.log('6️⃣ Simulando logout do frontend...');
    const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`, {
      refreshToken: newRefreshToken
    });
    console.log('✅ Logout realizado com sucesso');

    // 7. Tentar usar refresh token após logout
    console.log('\n7️⃣ Testando refresh após logout...');
    try {
      await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refreshToken: newRefreshToken
      });
      console.log('❌ Erro: Deveria ter rejeitado token após logout');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Token após logout rejeitado corretamente');
      } else {
        console.log('❌ Erro inesperado:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 Integração Frontend-Backend validada com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Executar teste se este arquivo for executado diretamente
if (require.main === module) {
  testFrontendIntegration();
}

module.exports = { testFrontendIntegration }; 