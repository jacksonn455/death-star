const axios = require('axios');

console.log('🔍 Verificando se o servidor está rodando...\n');

async function checkServer() {
  try {
    console.log('📡 Tentando conectar ao servidor...');
    
    const response = await axios.get('http://localhost:8000/health', {
      timeout: 5000
    });
    
    console.log('✅ Servidor está respondendo!');
    console.log('�� Status:', response.status);
    console.log('📋 Dados:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Servidor não está respondendo');
    console.log('   Erro:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solução:');
      console.log('   1. Execute "npm start" em outro terminal');
      console.log('   2. Aguarde o servidor iniciar');
      console.log('   3. Execute este teste novamente');
    }
  }
}

checkServer(); 