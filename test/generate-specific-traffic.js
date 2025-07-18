const axios = require("axios");

console.log("🎯 Gerando tráfego específico para New Relic...\n");

async function generateSpecificTraffic() {
  const requests = [
    { method: "GET", path: "/health", name: "Health" },
    { method: "GET", path: "/pacientes", name: "Pacientes" },
    { method: "GET", path: "/agenda", name: "Agenda" },
    { method: "GET", path: "/produtos", name: "Produtos" },
    { method: "GET", path: "/vendas", name: "Vendas" },
    { method: "POST", path: "/auth/login", name: "Auth Login", data: {} },
  ];

  for (let i = 1; i <= 10; i++) {
    console.log(`🔄 Lote ${i}/10:`);

    for (const request of requests) {
      try {
        const startTime = Date.now();

        let response;
        if (request.method === "GET") {
          response = await axios.get(`http://localhost:8000${request.path}`);
        } else {
          response = await axios.post(
            `http://localhost:8000${request.path}`,
            request.data
          );
        }

        const responseTime = Date.now() - startTime;
        console.log(
          `   ✅ ${request.name}: ${response.status} (${responseTime}ms)`
        );
      } catch (error) {
        const responseTime = Date.now() - startTime;
        const status = error.response?.status || "ERROR";
        console.log(`   ✅ ${request.name}: ${status} (${responseTime}ms)`);
      }

      //
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n✅ Tráfego específico gerado!");
  console.log("📊 Verifique no New Relic agora...");
}

generateSpecificTraffic().catch(console.error);
