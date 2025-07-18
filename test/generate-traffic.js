const axios = require("axios");

console.log("🚀 Gerando tráfego para acelerar a conexão...\n");

async function generateTraffic() {
  const endpoints = ["/health", "/nonexistent", "/auth/login"];

  for (let i = 1; i <= 20; i++) {
    console.log(`�� Requisição ${i}/20`);

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:8000${endpoint}`);
        console.log(`   ✅ ${endpoint}: ${response.status}`);
      } catch (error) {
        const status = error.response?.status || "ERROR";
        console.log(`   ✅ ${endpoint}: ${status}`);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log("\n✅ Tráfego gerado! Verifique o status novamente.");
}

generateTraffic();
