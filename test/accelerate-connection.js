const axios = require('axios');

console.log(' Acelerando conexão do New Relic...\n');

async function accelerateConnection() {
  const endpoints = [
    { path: '/health', name: 'Health Check' },
    { path: '/nonexistent', name: '404 Test' },
    { path: '/auth/login', name: 'Auth Test' }
  ];
  
  console.log('📡 Gerando tráfego para estabelecer conexão...\n');
  
  for (let round = 1; round <= 5; round++) {
    console.log(`🔄 Rodada ${round}/5:`);
    
    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await axios.get(`http://localhost:8000${endpoint.path}`, {
          timeout: 5000
        });
        const responseTime = Date.now() - startTime;
        
        console.log(`   ✅ ${endpoint.name}: ${response.status} (${responseTime}ms)`);
        
      } catch (error) {
        const startTime = Date.now();
        const responseTime = Date.now() - startTime;
        const status = error.response?.status || 'ERROR';
        console.log(`   ✅ ${endpoint.name}: ${status} (${responseTime}ms)`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✅ Tráfego gerado!');
  console.log(' Verifique o status do New Relic agora...');
}

accelerateConnection().catch(console.error); 