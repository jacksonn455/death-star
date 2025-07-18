const newrelic = require("newrelic");

console.log("🔍 Verificando dados do New Relic...\n");

console.log("�� Configuração Atual:");
console.log("- App Name:", newrelic.agent.config.app_name);
console.log(
  "- License Key:",
  newrelic.agent.config.license_key ? "OK" : "FALTA"
);
console.log("- Agent Enabled:", newrelic.agent.config.enabled);

console.log("\n📤 Enviando dados de teste...");

try {
  newrelic.recordCustomEvent("VerificationTest", {
    timestamp: Date.now(),
    test: true,
    message: "Teste de verificação",
  });

  newrelic.recordMetric("Custom/VerificationTest", 1);

  const testError = new Error("Test error for verification");
  newrelic.noticeError(testError, { verification: true });

  console.log("✅ Dados enviados com sucesso");
} catch (error) {
  console.log("❌ Erro ao enviar dados:", error.message);
}

setTimeout(() => {
  console.log("\n�� VERIFICAÇÃO FINAL:");
  console.log("1. Acesse: https://one.newrelic.com");
  console.log("2. Vá para: APM & Services");
  console.log('3. Procure por: "Death Star API"');
  console.log("4. Verifique se aparecem:");
  console.log("   • Eventos customizados");
  console.log("   • Métricas customizadas");
  console.log("   • Erros de teste");
  console.log("   • Transações da API");

  process.exit(0);
}, 10000);
