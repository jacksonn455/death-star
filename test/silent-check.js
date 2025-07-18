const axios = require('axios');

async function silentCheck() {
  try {
    const response = await axios.get('http://localhost:8000/health');
    console.log('✅ Servidor funcionando');
    console.log('📊 New Relic ativo (sem logs)');
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

silentCheck(); 