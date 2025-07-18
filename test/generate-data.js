const axios = require("axios");

console.log("�� Gerando dados para o New Relic...\n");

const baseURL = "http://localhost:8000";

async function generateData() {
  const requests = [
    { method: "GET", path: "/health", name: "Health Check" },
    { method: "GET", path: "/nonexistent", name: "404 Test" },
    { method: "POST", path: "/auth/login", name: "Auth Test", data: {} },
    { method: "GET", path: "/pacientes", name: "Pacientes Test" },
  ];

  for (let i = 0; i < 5; i++) {
    console.log(`\n🔄 Rodada ${i + 1}/5:`);

    for (const request of requests) {
      try {
        const startTime = Date.now();

        let response;
        if (request.method === "GET") {
          response = await axios.get(`${baseURL}${request.path}`);
        } else {
          response = await axios.post(
            `${baseURL}${request.path}`,
            request.data || {}
          );
        }

        const responseTime = Date.now() - startTime;
        console.log(
          `✅ ${request.name}: ${response.status} (${responseTime}ms)`
        );
      } catch (error) {
        const responseTime = Date.now() - startTime;
        const status = error.response?.status || "ERROR";
        console.log(`✅ ${request.name}: ${status} (${responseTime}ms)`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n�� Dados gerados! Verifique no New Relic:");
  console.log("📊 https://one.newrelic.com");
}

generateData().catch(console.error);
