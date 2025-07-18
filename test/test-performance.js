const axios = require('axios');

const API_URL = 'https://death-star.onrender.com/auth/login';
const TEST_DATA = {
  email: 'naagibz@gmail.com',
  password: 'Zoe@123'
};

const optimizedHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'DeathStar-Performance-Test/1.0'
};

async function testPerformance() {
  console.log('🚀 Iniciando teste de performance...\n');

  const tests = [
    {
      name: 'Teste 1: Headers mínimos',
      headers: optimizedHeaders
    },
    {
      name: 'Teste 2: Headers completos (original)',
      headers: {
        'accept': '*/*',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'origin': 'https://jacksonmagnabosco.dev',
        'priority': 'u=1, i',
        'referer': 'https://jacksonmagnabosco.dev/',
        'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
      }
    }
  ];

  for (const test of tests) {
    console.log(`📊 ${test.name}`);
    
    const times = [];
    const iterations = 3;

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      
      try {
        const response = await axios.post(API_URL, TEST_DATA, {
          headers: test.headers,
          timeout: 10000
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        times.push(duration);
        
        console.log(`  Tentativa ${i + 1}: ${duration}ms - Status: ${response.status}`);
        
        if (response.data.accessToken) {
          console.log(`  ✅ Login bem-sucedido`);
        }
        
      } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        times.push(duration);
        
        console.log(`  Tentativa ${i + 1}: ${duration}ms - Erro: ${error.message}`);
      }
      
      if (i < iterations - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    console.log(`  📈 Média: ${avgTime.toFixed(0)}ms | Mín: ${minTime}ms | Máx: ${maxTime}ms\n`);
  }

  console.log('🎯 Recomendações:');
  console.log('1. Use headers mínimos para melhor performance');
  console.log('2. Considere implementar cache de tokens');
  console.log('3. Monitore o cold start do Render');
  console.log('4. Implemente health checks para manter o servidor ativo');
}

if (require.main === module) {
  testPerformance().catch(console.error);
}

module.exports = { testPerformance }; 