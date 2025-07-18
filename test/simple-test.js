const newrelic = require("newrelic");

console.log("🧪 Teste simples do New Relic...\n");

console.log("✅ New Relic carregado");
console.log("📋 App Name:", newrelic.agent.config.app_name[0]);
console.log(
  "�� License Key:",
  newrelic.agent.config.license_key ? "OK" : "FALTA"
);

try {
  console.log("\n📤 Enviando dados de teste...");

  newrelic.recordCustomEvent("SimpleTest", {
    message: "Teste de conexão",
    timestamp: Date.now(),
  });

  newrelic.recordMetric("Custom/SimpleTest", 1);

  console.log("✅ Dados enviados com sucesso");
} catch (error) {
  console.log("❌ Erro ao enviar dados:", error.message);
}

setTimeout(() => {
  console.log("\n⏳ Aguardando 5 segundos...");

  setTimeout(() => {
    console.log("✅ Teste concluído");
    console.log("📊 Verifique em: https://one.newrelic.com");
    process.exit(0);
  }, 5000);
}, 1000);
