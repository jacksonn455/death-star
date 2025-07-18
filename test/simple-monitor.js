const axios = require("axios");

console.log(" Monitor simples do New Relic...\n");

async function simpleMonitor() {
  try {
    console.log("�� Conectando ao servidor...");

    const response = await axios.get("http://localhost:8000/health");
    const newRelic = response.data.newRelic;

    console.log("✅ Servidor respondendo!");
    console.log("\n📊 Status do New Relic:");
    console.log(`   Status: ${newRelic.status}`);
    console.log(`   Mensagem: ${newRelic.message}`);

    if (newRelic.details) {
      console.log("\n�� Detalhes:");
      console.log(`   - Habilitado: ${newRelic.details.enabled}`);
      console.log(
        `   - Licença: ${newRelic.details.licenseKeyPresent ? "OK" : "FALTA"}`
      );
      console.log(`   - App Name: ${newRelic.details.appName}`);
      console.log(`   - Conectado: ${newRelic.details.connected}`);
      console.log(`   - Rodando: ${newRelic.details.running}`);
    }

    if (newRelic.status === "ACTIVE") {
      console.log("\n🎉 New Relic está ATIVO e funcionando!");
    } else if (newRelic.status === "CONNECTING") {
      console.log("\n⏳ New Relic está conectando... Aguarde alguns minutos.");
    } else if (newRelic.status === "DISABLED") {
      console.log("\n⚠️  New Relic está desabilitado.");
    } else {
      console.log("\n❓ Status desconhecido:", newRelic.status);
    }
  } catch (error) {
    console.log("❌ Erro ao conectar:", error.message);
    console.log("\n💡 Verifique se o servidor está rodando:");
    console.log("   npm start");
  }
}

simpleMonitor();
