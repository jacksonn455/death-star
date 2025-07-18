const axios = require('axios');

const API_URL = 'https://death-star.onrender.com/health';
const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000;
async function pingServer() {
  try {
    const startTime = Date.now();
    const response = await axios.get(API_URL, {
      timeout: 5000,
      headers: {
        'User-Agent': 'DeathStar-KeepAlive/1.0'
      }
    });
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Servidor ativo - Status: ${response.status} - Tempo: ${duration}ms`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao pingar servidor: ${error.message}`);
    return false;
  }
}

function startKeepAlive() {
  console.log('🔄 Iniciando keep-alive para evitar cold starts...');
  console.log(`⏰ Intervalo: ${KEEP_ALIVE_INTERVAL / 1000 / 60} minutos`);

  pingServer();
  setInterval(pingServer, KEEP_ALIVE_INTERVAL);
}

if (require.main === module) {
  startKeepAlive();
}

module.exports = { pingServer, startKeepAlive }; 