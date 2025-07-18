const axios = require("axios");

async function monitorStatus() {
  console.log("�� Monitorando status do New Relic...\n");

  for (let i = 1; i <= 10; i++) {
    try {
      const response = await axios.get("http://localhost:8000/health");
      const newRelic = response.data.newRelic;

      console.log(`⏱️  Verificação ${i}/10:`);
      console.log(`   Status: ${newRelic.status}`);
      console.log(`   Mensagem: ${newRelic.message}`);
      console.log(`   Conectado: ${newRelic.details?.connected}`);
      console.log(`   Rodando: ${newRelic.details?.running}`);
      console.log("");

      if (newRelic.status === "ACTIVE") {
        console.log("🎉 New Relic está ATIVO!");
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 30000));
    } catch (error) {
      console.log(`❌ Erro na verificação ${i}:`, error.message);
    }
  }

  console.log("✅ Monitoramento concluído");
}

monitorStatus();
