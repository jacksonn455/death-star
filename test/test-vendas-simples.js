const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function testHealth() {
  console.log('🏥 Testando health check...\n');
  
  try {
    const response = await api.get('/health');
    console.log('✅ Servidor está funcionando:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Servidor não está respondendo:', error.message);
    return false;
  }
}

async function testServicosSemAuth() {
  console.log('\n🧪 Testando serviços sem autenticação...\n');
  
  try {
    // Teste 1: Tentar acessar serviços sem token
    console.log('1. Tentando acessar serviços sem autenticação...');
    try {
      await api.get('/vendas/services');
      console.log('❌ Erro: Deveria ter falhado por falta de autenticação');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Corretamente rejeitado por falta de autenticação');
      } else {
        console.log('❌ Erro inesperado:', error.response?.status, error.response?.data);
      }
    }

    // Teste 2: Tentar acessar produtos sem token
    console.log('\n2. Tentando acessar produtos sem autenticação...');
    try {
      await api.get('/produtos');
      console.log('❌ Erro: Deveria ter falhado por falta de autenticação');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Corretamente rejeitado por falta de autenticação');
      } else {
        console.log('❌ Erro inesperado:', error.response?.status, error.response?.data);
      }
    }

    // Teste 3: Tentar criar venda sem token
    console.log('\n3. Tentando criar venda sem autenticação...');
    try {
      await api.post('/vendas', {
        items: [],
        paymentMethod: 'pix'
      });
      console.log('❌ Erro: Deveria ter falhado por falta de autenticação');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Corretamente rejeitado por falta de autenticação');
      } else {
        console.log('❌ Erro inesperado:', error.response?.status, error.response?.data);
      }
    }

    console.log('\n🎉 Testes de autenticação concluídos!');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

async function testEstruturaAPI() {
  console.log('\n🧪 Testando estrutura da API...\n');
  
  try {
    // Teste 1: Verificar se as rotas existem
    console.log('1. Verificando rotas da API...');
    
    const routes = [
      '/health',
      '/vendas',
      '/vendas/services',
      '/produtos'
    ];

    for (const route of routes) {
      try {
        const response = await api.get(route);
        console.log(`✅ Rota ${route} existe`);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`✅ Rota ${route} existe (requer autenticação)`);
        } else {
          console.log(`❌ Rota ${route} não encontrada:`, error.response?.status);
        }
      }
    }

    console.log('\n🎉 Teste de estrutura da API concluído!');

  } catch (error) {
    console.error('❌ Erro no teste de estrutura:', error.message);
  }
}

async function testInicializacaoServicos() {
  console.log('\n🧪 Testando inicialização de serviços...\n');
  
  try {
    // Teste 1: Verificar se o servidor inicializou os serviços
    console.log('1. Verificando se serviços foram inicializados...');
    
    // Como não temos autenticação, vamos verificar se o servidor está rodando
    // e se as rotas estão configuradas corretamente
    
    const healthResponse = await api.get('/health');
    if (healthResponse.data.status === 'ok') {
      console.log('✅ Servidor está funcionando corretamente');
      console.log('   Serviços devem ter sido inicializados automaticamente');
    } else {
      console.log('❌ Servidor não está funcionando corretamente');
    }

    console.log('\n🎉 Teste de inicialização concluído!');

  } catch (error) {
    console.error('❌ Erro no teste de inicialização:', error.message);
  }
}

// Executar todos os testes
async function runTests() {
  console.log('🚀 Iniciando testes simples do Death Star\n');
  
  const serverOk = await testHealth();
  
  if (serverOk) {
    await testServicosSemAuth();
    await testEstruturaAPI();
    await testInicializacaoServicos();
  } else {
    console.log('\n❌ Servidor não está rodando. Execute primeiro:');
    console.log('   node app.js');
  }
  
  console.log('\n✨ Todos os testes simples foram concluídos!');
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testHealth,
  testServicosSemAuth,
  testEstruturaAPI,
  testInicializacaoServicos
}; 