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
      `${BASE_URL}/agenda`,
      {
        paciente,
        service: "Consulta",
        contact: "11999999999",
        responsible: "Dr. Teste",
        notes: "Teste de sobreposição",
        date,
        time,
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

async function testDetailedOverlap() {
  console.log("\n🔍 TESTE DETALHADO DE SOBREPOSIÇÃO");
  console.log("=====================================");

  try {
    console.log("\n1. Criando primeiro agendamento: 10:00-11:00");
    const firstAppointment = await createAppointment(
      "2024-01-30",
      "10:00",
      "Paciente A"
    );

    console.log(
      "\n2. Tentando criar segundo agendamento: 10:30-11:30 (sobreposição parcial)"
    );
    try {
      await createAppointment("2024-01-30", "10:30", "Paciente B");
      console.log("❌ ERRO: Sobreposição parcial foi permitida!");
    } catch (error) {
      console.log("📝 Status:", error.response?.status);
      console.log("📝 Erro:", error.response?.data);
      if (error.response?.status === 400) {
        console.log("✅ CORRETO: Erro 400 retornado");
        if (error.response.data.error.includes("sobreposição")) {
          console.log("✅ CORRETO: Mensagem de sobreposição detectada");
        } else {
          console.log("⚠️ Mensagem inesperada:", error.response.data.error);
        }
      } else {
        console.log("❌ ERRO INESPERADO");
      }
    }

    console.log(
      "\n3. Tentando criar terceiro agendamento: 09:30-10:30 (sobreposição parcial)"
    );
    try {
      await createAppointment("2024-01-30", "09:30", "Paciente C");
      console.log("❌ ERRO: Sobreposição parcial foi permitida!");
    } catch (error) {
      console.log("📝 Status:", error.response?.status);
      console.log("📝 Erro:", error.response?.data);
      if (error.response?.status === 400) {
        console.log("✅ CORRETO: Erro 400 retornado");
        if (error.response.data.error.includes("sobreposição")) {
          console.log("✅ CORRETO: Mensagem de sobreposição detectada");
        } else {
          console.log("⚠️ Mensagem inesperada:", error.response.data.error);
        }
      } else {
        console.log("❌ ERRO INESPERADO");
      }
    }

    console.log("\n4. Criando quarto agendamento: 11:00-12:00 (consecutivo)");
    try {
      await createAppointment("2024-01-30", "11:00", "Paciente D");
      console.log("✅ CORRETO: Agendamento consecutivo criado com sucesso");
    } catch (error) {
      console.log(
        "❌ ERRO: Agendamento consecutivo falhou:",
        error.response?.data || error.message
      );
    }
  } catch (error) {
    console.log("❌ Erro geral no teste:", error.message);
  }
}

async function cleanup() {
  console.log("\n🧹 Limpando dados de teste...");
  try {
    const response = await axios.get(`${BASE_URL}/agenda?paciente=Teste`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.data && response.data.data.length > 0) {
      for (const planner of response.data.data) {
        try {
          await axios.delete(`${BASE_URL}/agenda/${planner._id}`, {
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
  console.log("🚀 Iniciando teste detalhado de sobreposição...\n");

  try {
    await login();
    await testDetailedOverlap();
  } catch (error) {
    console.log("❌ Erro no teste:", error.message);
  } finally {
    await cleanup();
  }

  console.log("\n🏁 Teste concluído!");
}

main();
