const axios = require("axios");
const NewRelicTests = require("./test-newrelic");

/**
 * Teste de integração completo
 */
class IntegrationTest {
  constructor() {
    this.baseURL = "http://localhost:8000";
    this.results = [];
  }

  /**
   * Teste de conectividade básica
   */
  async testBasicConnectivity() {
    try {
      const response = await axios.get(`${this.baseURL}/health`);

      this.results.push({
        test: "Basic Connectivity",
        status: "PASS",
        details: `Server responding on ${this.baseURL}`,
      });

      console.log("✅ Servidor respondendo");
      return true;
    } catch (error) {
      this.results.push({
        test: "Basic Connectivity",
        status: "FAIL",
        details: `Cannot connect to ${this.baseURL}: ${error.message}`,
      });

      console.log("❌ Servidor não está respondendo");
      return false;
    }
  }

  /**
   * Teste de variáveis de ambiente
   */
  testEnvironmentVariables() {
    const requiredVars = [
      "NEW_RELIC_APP_NAME",
      "NEW_RELIC_LICENSE_KEY",
      "MONGO_URI",
    ];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length === 0) {
      this.results.push({
        test: "Environment Variables",
        status: "PASS",
        details:
          "Todas as variáveis de ambiente necessárias estão configuradas",
      });

      console.log("✅ Variáveis de ambiente configuradas");
      return true;
    } else {
      this.results.push({
        test: "Environment Variables",
        status: "FAIL",
        details: `Variáveis ausentes: ${missingVars.join(", ")}`,
      });

      console.log("❌ Variáveis de ambiente ausentes");
      return false;
    }
  }

  /**
   * Teste de dependências
   */
  testDependencies() {
    const requiredDeps = ["newrelic", "express", "mongoose", "dotenv"];

    const missingDeps = requiredDeps.filter((dep) => {
      try {
        require(dep);
        return false;
      } catch {
        return true;
      }
    });

    if (missingDeps.length === 0) {
      this.results.push({
        test: "Dependencies",
        status: "PASS",
        details: "Todas as dependências estão instaladas",
      });

      console.log("✅ Dependências instaladas");
      return true;
    } else {
      this.results.push({
        test: "Dependencies",
        status: "FAIL",
        details: `Dependências ausentes: ${missingDeps.join(", ")}`,
      });

      console.log("❌ Dependências ausentes");
      return false;
    }
  }

  /**
   * Executar teste completo
   */
  async runIntegrationTest() {
    console.log("🚀 Iniciando teste de integração...\n");

    this.testEnvironmentVariables();
    this.testDependencies();
    await this.testBasicConnectivity();

    const newRelicTests = new NewRelicTests();
    await newRelicTests.runAllTests();

    this.results = [...this.results, ...newRelicTests.testResults];

    this.printResults();
  }

  /**
   * Imprimir resultados
   */
  printResults() {
    console.log("\n📊 RESULTADOS DO TESTE DE INTEGRAÇÃO:");
    console.log("=".repeat(60));

    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;
    const total = this.results.length;

    this.results.forEach((result) => {
      const icon = result.status === "PASS" ? "✅" : "❌";
      console.log(`${icon} ${result.test}: ${result.status}`);
      console.log(`   ${result.details}`);
      console.log("");
    });

    console.log("=".repeat(60));
    console.log(`📈 RESUMO: ${passed}/${total} testes passaram`);

    if (failed === 0) {
      console.log("🎉 Integração completa! Sistema pronto para produção.");
    } else {
      console.log(
        `⚠️  ${failed} teste(s) falharam. Corrija antes de prosseguir.`
      );
    }
  }
}

if (require.main === module) {
  const integrationTest = new IntegrationTest();
  integrationTest.runIntegrationTest().catch(console.error);
}

module.exports = IntegrationTest;
