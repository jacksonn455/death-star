const axios = require('axios');

console.log(' Verificando status final do New Relic...\n');

async function checkFinalStatus() {
  try {
    const response = await axios.get('http://localhost:8000/health');
    const newRelic = response.data.newRelic;
    
    console.log('📊 Status Atual:');
    console.log(`   Status: ${newRelic.status}`);
    console.log(`   Mensagem: ${newRelic.message}`);
    console.log(`   Conectado: ${newRelic.details?.connected}`);
    console.log(`   Rodando: ${newRelic.details?.running}`);
    
    if (newRelic.status === 'ACTIVE') {
      console.log('\n SUCESSO! New Relic está ATIVO!');
      console.log('📊 Verifique em: https://one.newrelic.com');
      console.log('   • Vá para APM & Services');
      console.log('   • Procure por "Death Star API"');
    } else if (newRelic.status === 'CONNECTING') {
      console.log('\n⏳ Ainda conectando...');
      console.log('💡 Isso é normal, pode levar alguns minutos.');
      console.log('📊 Verifique em: https://one.newrelic.com mesmo assim');
    } else {
      console.log('\n⚠️  Status inesperado:', newRelic.status);
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

checkFinalStatus(); 