const axios = require("axios");
const {
  recordCustomError,
  recordCustomEvent,
  recordCustomMetric,
  startCustomSegment,
} = require("../middlewares/newrelic");

/**
 * Testes para validação do New Relic
 */
class NewRelicTests {
  constructor() {
    this.baseURL = "http://localhost:8000";
    this.testResults = [];
  }

  /**
   * Teste 1: Verificar se o New Relic está carregado
   */
  async testNewRelicLoaded() {
    try {
      const newrelic = require("newrelic");
      const appName = newrelic.agent.config.app_name[0];

      this.testResults.push({
        test: "New Relic Loaded",
        status: "PASS",
        details: `App Name: ${appName}`,
      });

      console.log("✅ New Relic carregado com sucesso");
      return true;
    } catch (error) {
      this.testResults.push({
        test: "New Relic Loaded",
        status: "FAIL",
        details: error.message,
      });

      console.log("❌ New Relic não foi carregado");
      return false;
    }
  }

  /**
   * Teste 2: Verificar configuração do New Relic
   */
  async testNewRelicConfig() {
    try {
      const newrelic = require("newrelic");
      const config = newrelic.agent.config;

      const requiredConfigs = [
        "license_key",
        "app_name",
        "distributed_tracing.enabled",
        "transaction_tracer.enabled",
        "error_collector.enabled",
      ];

      const missingConfigs = requiredConfigs.filter((configPath) => {
        const value = configPath
          .split(".")
          .reduce((obj, key) => obj?.[key], config);
        return value === undefined || value === null;
      });

      if (missingConfigs.length === 0) {
        this.testResults.push({
          test: "New Relic Configuration",
          status: "PASS",
          details: "Todas as configurações necessárias estão presentes",
        });

        console.log("✅ Configuração do New Relic válida");
        return true;
      } else {
        this.testResults.push({
          test: "New Relic Configuration",
          status: "FAIL",
          details: `Configurações ausentes: ${missingConfigs.join(", ")}`,
        });

        console.log("❌ Configurações do New Relic incompletas");
        return false;
      }
    } catch (error) {
      this.testResults.push({
        test: "New Relic Configuration",
        status: "FAIL",
        details: error.message,
      });

      console.log("❌ Erro ao verificar configuração do New Relic");
      return false;
    }
  }

  /**
   * Teste 3: Testar funções customizadas do New Relic
   */
  async testCustomFunctions() {
    try {
      const testError = new Error("Test error for New Relic");
      recordCustomError(testError, { test: true });

      recordCustomEvent("TestEvent", {
        test: true,
        timestamp: Date.now(),
      });

      recordCustomMetric("Test/Metric", 42);

      startCustomSegment("TestSegment", () => {
        return "test result";
      });

      this.testResults.push({
        test: "Custom New Relic Functions",
        status: "PASS",
        details: "Todas as funções customizadas executadas sem erro",
      });

      console.log("✅ Funções customizadas do New Relic funcionando");
      return true;
    } catch (error) {
      this.testResults.push({
        test: "Custom New Relic Functions",
        status: "FAIL",
        details: error.message,
      });

      console.log("❌ Erro nas funções customizadas do New Relic");
      return false;
    }
  }

  /**
   * Teste 4: Testar endpoints da API com monitoramento
   */
  async testAPIEndpoints() {
    const endpoints = [
      { path: "/health", method: "GET", expectedStatus: 200 },
      { path: "/auth/login", method: "POST", expectedStatus: 400 },
      { path: "/pacientes", method: "GET", expectedStatus: 401 },
      { path: "/nonexistent", method: "GET", expectedStatus: 404 },
    ];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();

        let response;
        if (endpoint.method === "GET") {
          response = await axios.get(`${this.baseURL}${endpoint.path}`);
        } else if (endpoint.method === "POST") {
          response = await axios.post(`${this.baseURL}${endpoint.path}`, {});
        }

        const responseTime = Date.now() - startTime;

        this.testResults.push({
          test: `API Endpoint: ${endpoint.method} ${endpoint.path}`,
          status: response.status === endpoint.expectedStatus ? "PASS" : "FAIL",
          details: `Status: ${response.status}, Time: ${responseTime}ms`,
        });

        console.log(
          `✅ ${endpoint.method} ${endpoint.path} - ${response.status} (${responseTime}ms)`
        );
      } catch (error) {
        const startTime = Date.now();
        const responseTime = Date.now() - startTime;
        const status = error.response?.status || "NETWORK_ERROR";

        this.testResults.push({
          test: `API Endpoint: ${endpoint.method} ${endpoint.path}`,
          status: status === endpoint.expectedStatus ? "PASS" : "FAIL",
          details: `Status: ${status}, Time: ${responseTime}ms, Error: ${error.message}`,
        });

        console.log(
          `✅ ${endpoint.method} ${endpoint.path} - ${status} (${responseTime}ms)`
        );
      }
    }
  }

  /**
   * Teste 5: Testar performance e métricas
   */
  async testPerformance() {
    try {
      const iterations = 10;
      const times = [];

      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();

        try {
          await axios.get(`${this.baseURL}/health`);
        } catch (error) {}

        const responseTime = Date.now() - startTime;
        times.push(responseTime);

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);

      recordCustomMetric("Test/AverageResponseTime", avgTime);
      recordCustomMetric("Test/MinResponseTime", minTime);
      recordCustomMetric("Test/MaxResponseTime", maxTime);

      this.testResults.push({
        test: "Performance Test",
        status: "PASS",
        details: `Avg: ${avgTime.toFixed(
          2
        )}ms, Min: ${minTime}ms, Max: ${maxTime}ms`,
      });

      console.log(`✅ Performance test: Avg ${avgTime.toFixed(2)}ms`);
      return true;
    } catch (error) {
      this.testResults.push({
        test: "Performance Test",
        status: "FAIL",
        details: error.message,
      });

      console.log("❌ Erro no teste de performance");
      return false;
    }
  }

  /**
   * Teste 6: Testar tratamento de erros
   */
  async testErrorHandling() {
    try {
      await axios.get(`${this.baseURL}/nonexistent`);

      this.testResults.push({
        test: "Error Handling",
        status: "FAIL",
        details: "Endpoint deveria retornar 404",
      });
    } catch (error) {
      if (error.response?.status === 404) {
        this.testResults.push({
          test: "Error Handling",
          status: "PASS",
          details: "Erro 404 capturado corretamente",
        });

        console.log("✅ Tratamento de erros funcionando");
        return true;
      } else {
        this.testResults.push({
          test: "Error Handling",
          status: "FAIL",
          details: `Status inesperado: ${error.response?.status}`,
        });

        console.log("❌ Tratamento de erros não funcionando corretamente");
        return false;
      }
    }
  }

  /**
   * Teste 7: Verificar se o servidor está rodando
   */
  async testServerRunning() {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 5000,
      });

      this.testResults.push({
        test: "Server Running",
        status: "PASS",
        details: `Servidor respondendo em ${this.baseURL}`,
      });

      console.log("✅ Servidor está rodando");
      return true;
    } catch (error) {
      this.testResults.push({
        test: "Server Running",
        status: "FAIL",
        details: `Servidor não está respondendo: ${error.message}`,
      });

      console.log("❌ Servidor não está rodando");
      console.log(' Execute "npm start" em outro terminal primeiro');
      return false;
    }
  }

  /**
   * Executar todos os testes
   */
  async runAllTests() {
    console.log("🚀 Iniciando testes do New Relic...\n");

    const serverRunning = await this.testServerRunning();

    if (!serverRunning) {
      console.log(
        "\n⚠️  Servidor não está rodando. Alguns testes serão pulados."
      );
      console.log(
        ' Execute "npm start" em outro terminal e tente novamente.\n'
      );
    }

    await this.testNewRelicLoaded();
    await this.testNewRelicConfig();
    await this.testCustomFunctions();

    if (serverRunning) {
      await this.testAPIEndpoints();
      await this.testPerformance();
      await this.testErrorHandling();
    }

    this.printResults();
  }

  /**
   * Imprimir resultados dos testes
   */
  printResults() {
    console.log("\n📊 RESULTADOS DOS TESTES:");
    console.log("=".repeat(50));

    const passed = this.testResults.filter((r) => r.status === "PASS").length;
    const failed = this.testResults.filter((r) => r.status === "FAIL").length;
    const total = this.testResults.length;

    this.testResults.forEach((result) => {
      const icon = result.status === "PASS" ? "✅" : "❌";
      console.log(`${icon} ${result.test}: ${result.status}`);
      console.log(`   ${result.details}`);
      console.log("");
    });

    console.log("=".repeat(50));
    console.log(`📈 RESUMO: ${passed}/${total} testes passaram`);

    if (failed === 0) {
      console.log(
        "🎉 Todos os testes passaram! New Relic está funcionando corretamente."
      );
    } else {
      console.log(`⚠️  ${failed} teste(s) falharam. Verifique a configuração.`);
    }
  }
}

if (require.main === module) {
  const tests = new NewRelicTests();
  tests.runAllTests().catch(console.error);
}

module.exports = NewRelicTests;
