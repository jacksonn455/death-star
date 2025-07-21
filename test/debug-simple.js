const axios = require("axios");

const BASE_URL = "http://localhost:3000";
let authToken = "";

async function login() {
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: "test@example.com",
      password: "test123",
    });
    authToken = loginResponse.data.token;
    console.log("✅ Login realizado com sucesso");
  } catch (error) {
    console.log("❌ Erro no login:", error.response?.data || error.message);
    throw error;
  }
}

async function createAppointment(date, time, paciente = "Teste Paciente") {
  try {
    const response = await axios.post(
      `${BASE_URL}/planner`,
      {
        date,
        time,
        service: "Consulta",
        paciente,
        responsible: "Dr. Teste",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log(`✅ Agendamento criado: ${date} ${time} - ${paciente}`);
    return response.data;
  } catch (error) {
    console.log(
      `❌ Erro ao criar agendamento ${date} ${time}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

async function testSimpleOverlap() {
  console.log("\n🔍 TESTE SIMPLES DE SOBREPOSIÇÃO");
  console.log("==================================");

  try {
    console.log("\n1. Criando primeiro agendamento: 14:00-15:00");
    await createAppointment("2024-01-25", "14:00", "Paciente A");

    console.log(
      "\n2. Tentando criar segundo agendamento: 14:30-15:30 (sobreposição parcial)"
    );
    try {
      await createAppointment("2024-01-25", "14:30", "Paciente B");
      console.log("❌ ERRO: Sobreposição parcial foi permitida!");
    } catch (error) {
      console.log("📝 Status:", error.response?.status);
      console.log("📝 Erro:", error.response?.data);
      if (error.response?.status === 400) {
        console.log("✅ CORRETO: Erro 400 retornado");
      } else {
        console.log("❌ ERRO INESPERADO");
      }
    }
  } catch (error) {
    console.log("❌ Erro geral no teste:", error.message);
  }
}

async function cleanup() {
  console.log("\n🧹 Limpando dados de teste...");
  try {
    const response = await axios.get(`${BASE_URL}/planner?paciente=Teste`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.data && response.data.data.length > 0) {
      for (const planner of response.data.data) {
        try {
          await axios.delete(`${BASE_URL}/planner/${planner._id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        } catch (error) {
          console.log(
            `⚠️ Erro ao deletar agendamento ${planner._id}:`,
            error.response?.data || error.message
          );
        }
      }
    }
    console.log("✅ Limpeza concluída");
  } catch (error) {
    console.log("⚠️ Erro na limpeza:", error.response?.data || error.message);
  }
}

async function main() {
  console.log("🚀 Iniciando teste simples de sobreposição...\n");

  try {
    await login();
    await testSimpleOverlap();
  } catch (error) {
    console.log("❌ Erro no teste:", error.message);
  } finally {
    await cleanup();
  }

  console.log("\n🏁 Teste concluído!");
}

main();
