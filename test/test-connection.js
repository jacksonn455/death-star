const newrelic = require("newrelic");

console.log("🔍 Verificando conexão do New Relic...");

console.log("📋 Configuração:");
console.log("- App Name:", newrelic.agent.config.app_name);
console.log(
  "- License Key:",
  newrelic.agent.config.license_key ? "Presente" : "Ausente"
);
console.log("- Agent Enabled:", newrelic.agent.config.enabled);

console.log("\n📊 Status do Agente:");
console.log("- Agent Running:", newrelic.agent.running);
console.log("- Connected:", newrelic.agent.connected);

try {
  console.log("\n🧪 Enviando dados de teste...");

  newrelic.recordCustomEvent("ConnectionTest", {
    timestamp: Date.now(),
    test: true,
    message: "Teste de conexão",
  });

  newrelic.recordMetric("Custom/ConnectionTest", 1);

  console.log("✅ Dados de teste enviados");
} catch (error) {
  console.log("❌ Erro ao enviar dados:", error.message);
}

setTimeout(() => {
  console.log("\n⏳ Aguardando 5 segundos para verificar conexão...");

  setTimeout(() => {
    console.log("✅ Teste de conexão concluído");
    console.log(
      "📊 Verifique no dashboard do New Relic se os dados apareceram"
    );
    process.exit(0);
  }, 5000);
}, 1000);
