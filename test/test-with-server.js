const { spawn } = require("child_process");

console.log(" Iniciando servidor com New Relic...\n");

const server = spawn("node", ["app.js"], {
  stdio: "pipe",
  env: {
    ...process.env,
    NEW_RELIC_APP_NAME: "Death Star API",
    NEW_RELIC_LICENSE_KEY: "dc8629336ac5d2406c5c09ad34122eceFFFFNRAL",
  },
});

server.stdout.on("data", (data) => {
  const output = data.toString();
  console.log(" Servidor:", output.trim());

  if (output.includes("New Relic monitoramento ativo")) {
    console.log("\n✅ Servidor iniciado com New Relic!");
    console.log("📊 Verifique em: https://one.newrelic.com");

    setTimeout(() => {
      console.log("\n🛑 Parando servidor...");
      server.kill("SIGTERM");
      process.exit(0);
    }, 30000);
  }
});

server.stderr.on("data", (data) => {
  console.log("⚠️  Erro:", data.toString().trim());
});

server.on("close", (code) => {
  console.log(`\n🏁 Servidor finalizado com código ${code}`);
});
