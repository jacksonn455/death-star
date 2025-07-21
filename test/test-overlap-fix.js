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

async function testOverlapScenarios() {
  console.log("\n🔍 TESTE DE SOBREPOSIÇÕES - VALIDAÇÃO CORRIGIDA");
  console.log("==================================================");

  const results = {
    exactConflict: false,
    partialOverlap1: false,
    partialOverlap2: false,
    consecutiveValid: false,
    differentDateValid: false,
  };

  try {
    console.log("\n1. TESTE: Conflito exato (mesmo horário)");
    console.log("Criando primeiro agendamento: 10:00-11:00");
    await createAppointment("2024-01-20", "10:00", "Paciente A");

    console.log(
      "Tentando criar segundo agendamento: 10:00-11:00 (mesmo horário)"
    );
    try {
      await createAppointment("2024-01-20", "10:00", "Paciente B");
      console.log(
        "❌ ERRO: Segundo agendamento foi criado quando deveria falhar!"
      );
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response.data.error.includes(
          "Já existe um agendamento para essa data e horário"
        )
      ) {
        console.log("✅ CORRETO: Conflito exato detectado");
        results.exactConflict = true;
      } else {
        console.log(
          "❌ ERRO INESPERADO:",
          error.response?.status,
          error.response?.data
        );
      }
    }

    console.log(
      "\n2. TESTE: Sobreposição parcial 1 (novo: 10:30-11:30, existente: 10:00-11:00)"
    );
    try {
      await createAppointment("2024-01-20", "10:30", "Paciente C");
      console.log("❌ ERRO: Sobreposição parcial foi permitida!");
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response.data.error.includes("sobreposição de horários")
      ) {
        console.log("✅ CORRETO: Sobreposição parcial 1 detectada");
        results.partialOverlap1 = true;
      } else {
        console.log(
          "❌ ERRO INESPERADO:",
          error.response?.status,
          error.response?.data
        );
      }
    }

    console.log(
      "\n3. TESTE: Sobreposição parcial 2 (novo: 09:30-10:30, existente: 10:00-11:00)"
    );
    try {
      await createAppointment("2024-01-20", "09:30", "Paciente D");
      console.log("❌ ERRO: Sobreposição parcial foi permitida!");
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response.data.error.includes("sobreposição de horários")
      ) {
        console.log("✅ CORRETO: Sobreposição parcial 2 detectada");
        results.partialOverlap2 = true;
      } else {
        console.log(
          "❌ ERRO INESPERADO:",
          error.response?.status,
          error.response?.data
        );
      }
    }

    console.log("\n4. TESTE: Agendamentos consecutivos válidos");
    console.log("Criando agendamento consecutivo: 11:00-12:00");
    try {
      await createAppointment("2024-01-20", "11:00", "Paciente E");
      console.log("✅ CORRETO: Agendamento consecutivo criado com sucesso");
      results.consecutiveValid = true;
    } catch (error) {
      console.log(
        "❌ ERRO: Agendamento consecutivo falhou:",
        error.response?.data || error.message
      );
    }

    console.log("\n5. TESTE: Mesmo horário em datas diferentes");
    console.log("Criando agendamento em data diferente: 2024-01-21 10:00");
    try {
      await createAppointment("2024-01-21", "10:00", "Paciente F");
      console.log(
        "✅ CORRETO: Mesmo horário em data diferente criado com sucesso"
      );
      results.differentDateValid = true;
    } catch (error) {
      console.log(
        "❌ ERRO: Mesmo horário em data diferente falhou:",
        error.response?.data || error.message
      );
    }
  } catch (error) {
    console.log("❌ Erro geral no teste:", error.message);
  }

  return results;
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
  console.log(
    "🚀 Iniciando teste de validação de sobreposições corrigida...\n"
  );

  try {
    await login();
    const results = await testOverlapScenarios();

    console.log("\n📊 RESULTADOS DOS TESTES:");
    console.log("=====================================");
    console.log(
      `✅ Conflito exato: ${results.exactConflict ? "PASS" : "FAIL"}`
    );
    console.log(
      `✅ Sobreposição parcial 1: ${results.partialOverlap1 ? "PASS" : "FAIL"}`
    );
    console.log(
      `✅ Sobreposição parcial 2: ${results.partialOverlap2 ? "PASS" : "FAIL"}`
    );
    console.log(
      `✅ Agendamentos consecutivos: ${
        results.consecutiveValid ? "PASS" : "FAIL"
      }`
    );
    console.log(
      `✅ Mesmo horário em datas diferentes: ${
        results.differentDateValid ? "PASS" : "FAIL"
      }`
    );

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;

    console.log(`\n📈 RESUMO: ${passedTests}/${totalTests} testes passaram`);

    if (passedTests === totalTests) {
      console.log("🎉 TODOS OS TESTES PASSARAM! A correção funcionou!");
    } else {
      console.log("⚠️ Alguns testes falharam. Verifique a implementação.");
    }
  } catch (error) {
    console.log("❌ Erro no teste:", error.message);
  } finally {
    await cleanup();
  }

  console.log("\n🏁 Teste concluído!");
}

main();
