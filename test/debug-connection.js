const newrelic = require("newrelic");
const https = require("https");

console.log("�� Debug detalhado da conexão New Relic...\n");

console.log("1️⃣ CONFIGURAÇÃO:");
console.log("- App Name:", newrelic.agent.config.app_name);
console.log(
  "- License Key:",
  newrelic.agent.config.license_key ? "Presente" : "Ausente"
);
console.log("- Host:", newrelic.agent.config.host);
console.log("- Port:", newrelic.agent.config.port);
console.log("- SSL:", newrelic.agent.config.ssl);

console.log("\n2️⃣ TESTE DE CONECTIVIDADE:");

const testConnection = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "collector.newrelic.com",
        port: 443,
        path: "/",
        method: "GET",
        timeout: 10000,
      },
      (res) => {
        console.log("✅ Conectividade com New Relic OK");
        console.log("   Status:", res.statusCode);
        resolve();
      }
    );

    req.on("error", (error) => {
      console.log("❌ Erro de conectividade:", error.message);
      reject(error);
    });

    req.on("timeout", () => {
      console.log("⏰ Timeout na conexão");
      req.destroy();
      reject(new Error("Timeout"));
    });

    req.end();
  });
};

console.log("\n3️⃣ STATUS DO AGENTE:");
console.log("- Agent Running:", newrelic.agent.running);
console.log("- Connected:", newrelic.agent.connected);
console.log("- Agent Config:", newrelic.agent.config.enabled);

async function runTests() {
  try {
    await testConnection();

    console.log("\n4️⃣ ENVIANDO DADOS DE TESTE...");

    newrelic.recordCustomEvent("DebugTest", {
      timestamp: Date.now(),
      test: true,
      environment: process.env.NODE_ENV || "development",
    });

    newrelic.recordMetric("Custom/DebugTest", 1);

    const testError = new Error("Test error for debugging");
    newrelic.noticeError(testError, { debug: true });

    console.log("✅ Dados de teste enviados");

    setTimeout(() => {
      console.log("\n5️⃣ VERIFICAÇÃO FINAL:");
      console.log("- Verifique no dashboard do New Relic se aparecem:");
      console.log("  • Eventos customizados");
      console.log("  • Métricas customizadas");
      console.log("  • Erros de teste");
      console.log("\n📊 Dashboard: https://one.newrelic.com");

      process.exit(0);
    }, 10000);
  } catch (error) {
    console.log("❌ Erro nos testes:", error.message);
    process.exit(1);
  }
}

runTests();
