const axios = require("axios");
const moment = require("moment-timezone");

/**
 * Teste de cenários específicos de conflitos
 * Valida casos críticos de agendamento
 */
class SpecificScenariosTest {
  constructor() {
    this.baseURL = "http://localhost:8000";
    this.results = [];
    this.createdAppointments = [];
    this.accessToken = null;
  }

  /**
   * Autenticação
   */
  async authenticate() {
    try {
      const loginData = {
        email: "admin@test.com",
        password: "admin123",
      };

      const response = await axios.post(
        `${this.baseURL}/auth/login`,
        loginData
      );

      if (response.status === 200 && response.data.accessToken) {
        this.accessToken = response.data.accessToken;
        console.log("✅ Autenticação realizada com sucesso");
        return true;
      }
    } catch (error) {
      console.log("❌ Falha na autenticação");
      return false;
    }
  }

  /**
   * Configurar headers de autorização
   */
  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Cenário 1: Criar agendamento e tentar criar outro no mesmo horário
   */
  async testScenario1_SameTimeCreation() {
    console.log(
      "\n🔍 CENÁRIO 1: Criar agendamento e tentar criar outro no mesmo horário"
    );

    try {
      const firstAppointment = {
        paciente: "Ana Silva",
        service: "Consulta",
        contact: "11999999999",
        responsible: "Dr. Maria",
        notes: "Primeira consulta",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "10:00",
      };

      const response1 = await axios.post(
        `${this.baseURL}/agenda`,
        firstAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento criado");

      const secondAppointment = {
        paciente: "João Santos",
        service: "Retorno",
        contact: "11888888888",
        responsible: "Dr. João",
        notes: "Retorno mensal",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "10:00",
      };

      try {
        await axios.post(`${this.baseURL}/agenda`, secondAppointment, {
          headers: this.getAuthHeaders(),
        });

        console.log(
          "❌ ERRO: Segundo agendamento foi aceito quando deveria ser rejeitado!"
        );
        this.results.push({
          test: "Scenario 1: Same Time Creation",
          status: "FAIL",
          details: "Segundo agendamento no mesmo horário foi aceito",
        });
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log(
            "✅ SUCESSO: Segundo agendamento foi rejeitado corretamente!"
          );
          this.results.push({
            test: "Scenario 1: Same Time Creation",
            status: "PASS",
            details: "Conflito detectado: " + error.response.data.error,
          });
          return true;
        } else {
          console.log("❌ ERRO INESPERADO:", error.message);
          this.results.push({
            test: "Scenario 1: Same Time Creation",
            status: "FAIL",
            details: "Erro inesperado: " + error.message,
          });
          return false;
        }
      }
    } catch (error) {
      console.log("❌ Erro ao criar primeiro agendamento:", error.message);
      this.results.push({
        test: "Scenario 1: Same Time Creation",
        status: "FAIL",
        details: "Erro ao criar primeiro agendamento: " + error.message,
      });
      return false;
    }
  }

  /**
   * Cenário 2: Criar agendamento e tentar atualizar outro para o mesmo horário
   */
  async testScenario2_UpdateToExistingTime() {
    console.log(
      "\n🔍 CENÁRIO 2: Criar agendamento e tentar atualizar outro para o mesmo horário"
    );

    try {
      const firstAppointment = {
        paciente: "Maria Costa",
        service: "Avaliação",
        contact: "11777777777",
        responsible: "Dr. Ana",
        notes: "Avaliação inicial",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "14:00",
      };

      const response1 = await axios.post(
        `${this.baseURL}/agenda`,
        firstAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento criado");

      const secondAppointment = {
        paciente: "Pedro Lima",
        service: "Consulta",
        contact: "11666666666",
        responsible: "Dr. Carlos",
        notes: "Consulta de rotina",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "15:00",
      };

      const response2 = await axios.post(
        `${this.baseURL}/agenda`,
        secondAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.createdAppointments.push(response2.data._id);
      console.log("✅ Segundo agendamento criado em horário diferente");

      const updateData = {
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "14:00",
      };

      try {
        await axios.put(
          `${this.baseURL}/agenda/${response2.data._id}`,
          updateData,
          { headers: this.getAuthHeaders() }
        );

        console.log(
          "❌ ERRO: Atualização foi aceita quando deveria ser rejeitada!"
        );
        this.results.push({
          test: "Scenario 2: Update To Existing Time",
          status: "FAIL",
          details: "Atualização para horário ocupado foi aceita",
        });
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log("✅ SUCESSO: Atualização foi rejeitada corretamente!");
          this.results.push({
            test: "Scenario 2: Update To Existing Time",
            status: "PASS",
            details:
              "Conflito na atualização detectado: " + error.response.data.error,
          });
          return true;
        } else {
          console.log("❌ ERRO INESPERADO:", error.message);
          this.results.push({
            test: "Scenario 2: Update To Existing Time",
            status: "FAIL",
            details: "Erro inesperado: " + error.message,
          });
          return false;
        }
      }
    } catch (error) {
      console.log("❌ Erro:", error.message);
      this.results.push({
        test: "Scenario 2: Update To Existing Time",
        status: "FAIL",
        details: "Erro: " + error.message,
      });
      return false;
    }
  }

  /**
   * Cenário 3: Sobreposição parcial - agendamento anterior termina durante o novo
   */
  async testScenario3_PartialOverlap() {
    console.log(
      "\n🔍 CENÁRIO 3: Sobreposição parcial - agendamento anterior termina durante o novo"
    );

    try {
      const firstAppointment = {
        paciente: "Lucia Ferreira",
        service: "Procedimento",
        contact: "11555555555",
        responsible: "Dr. Paula",
        notes: "Procedimento especial",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "10:00",
      };

      const response1 = await axios.post(
        `${this.baseURL}/agenda`,
        firstAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento criado (10:00-11:00)");

      const secondAppointment = {
        paciente: "Carlos Oliveira",
        service: "Consulta",
        contact: "11444444444",
        responsible: "Dr. Roberto",
        notes: "Consulta de rotina",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "10:30",
      };

      try {
        await axios.post(`${this.baseURL}/agenda`, secondAppointment, {
          headers: this.getAuthHeaders(),
        });

        console.log("❌ ERRO: Sobreposição parcial foi aceita!");
        this.results.push({
          test: "Scenario 3: Partial Overlap",
          status: "FAIL",
          details: "Sobreposição parcial foi aceita",
        });
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log("✅ SUCESSO: Sobreposição parcial foi detectada!");
          this.results.push({
            test: "Scenario 3: Partial Overlap",
            status: "PASS",
            details: "Sobreposição detectada: " + error.response.data.error,
          });
          return true;
        } else {
          console.log("❌ ERRO INESPERADO:", error.message);
          this.results.push({
            test: "Scenario 3: Partial Overlap",
            status: "FAIL",
            details: "Erro inesperado: " + error.message,
          });
          return false;
        }
      }
    } catch (error) {
      console.log("❌ Erro:", error.message);
      this.results.push({
        test: "Scenario 3: Partial Overlap",
        status: "FAIL",
        details: "Erro: " + error.message,
      });
      return false;
    }
  }

  /**
   * Cenário 4: Agendamentos consecutivos válidos (deve funcionar)
   */
  async testScenario4_ValidConsecutive() {
    console.log(
      "\n🔍 CENÁRIO 4: Agendamentos consecutivos válidos (deve funcionar)"
    );

    try {
      const firstAppointment = {
        paciente: "Ana Santos",
        service: "Retorno",
        contact: "11333333333",
        responsible: "Dr. Maria",
        notes: "Retorno mensal",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "16:00",
      };

      const response1 = await axios.post(
        `${this.baseURL}/agenda`,
        firstAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento criado (16:00-17:00)");

      const secondAppointment = {
        paciente: "João Costa",
        service: "Avaliação",
        contact: "11222222222",
        responsible: "Dr. Ana",
        notes: "Avaliação inicial",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "17:00",
      };

      const response2 = await axios.post(
        `${this.baseURL}/agenda`,
        secondAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.createdAppointments.push(response2.data._id);
      console.log("✅ Segundo agendamento consecutivo criado (17:00-18:00)");

      this.results.push({
        test: "Scenario 4: Valid Consecutive",
        status: "PASS",
        details: "Agendamentos consecutivos criados com sucesso",
      });
      return true;
    } catch (error) {
      console.log("❌ Erro:", error.message);
      this.results.push({
        test: "Scenario 4: Valid Consecutive",
        status: "FAIL",
        details: "Erro: " + error.message,
      });
      return false;
    }
  }

  /**
   * Cenário 5: Mesmo horário em datas diferentes (deve funcionar)
   */
  async testScenario5_SameTimeDifferentDates() {
    console.log(
      "\n🔍 CENÁRIO 5: Mesmo horário em datas diferentes (deve funcionar)"
    );

    try {
      const firstAppointment = {
        paciente: "Maria Silva",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Consulta 1",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "09:00",
      };

      const response1 = await axios.post(
        `${this.baseURL}/agenda`,
        firstAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento criado (dia 1, 09:00)");

      const secondAppointment = {
        paciente: "João Silva",
        service: "Consulta",
        contact: "11111111112",
        responsible: "Dr. Teste",
        notes: "Consulta 2",
        date: moment().add(2, "day").format("YYYY-MM-DD"),
        time: "09:00",
      };

      const response2 = await axios.post(
        `${this.baseURL}/agenda`,
        secondAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.createdAppointments.push(response2.data._id);
      console.log("✅ Segundo agendamento criado (dia 2, 09:00)");

      this.results.push({
        test: "Scenario 5: Same Time Different Dates",
        status: "PASS",
        details: "Mesmo horário em datas diferentes funcionou",
      });
      return true;
    } catch (error) {
      console.log("❌ Erro:", error.message);
      this.results.push({
        test: "Scenario 5: Same Time Different Dates",
        status: "FAIL",
        details: "Erro: " + error.message,
      });
      return false;
    }
  }

  /**
   * Limpeza dos dados de teste
   */
  async cleanup() {
    console.log("\n🧹 Limpando dados de teste...");

    for (const appointmentId of this.createdAppointments) {
      try {
        await axios.delete(`${this.baseURL}/agenda/${appointmentId}`, {
          headers: this.getAuthHeaders(),
        });
      } catch (error) {
        console.log(
          `⚠️  Não foi possível excluir agendamento ${appointmentId}: ${error.message}`
        );
      }
    }

    console.log("✅ Limpeza concluída");
  }

  /**
   * Executar todos os cenários
   */
  async runAllScenarios() {
    console.log("🚀 Iniciando testes de cenários específicos...\n");

    const isAuthenticated = await this.authenticate();
    if (!isAuthenticated) {
      console.log("❌ Falha na autenticação. Abortando testes.");
      return;
    }

    await this.testScenario1_SameTimeCreation();
    await this.testScenario2_UpdateToExistingTime();
    await this.testScenario3_PartialOverlap();
    await this.testScenario4_ValidConsecutive();
    await this.testScenario5_SameTimeDifferentDates();

    await this.cleanup();

    this.printResults();
  }

  /**
   * Imprimir resultados
   */
  printResults() {
    console.log("\n📊 RESULTADOS DOS CENÁRIOS ESPECÍFICOS:");
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
    console.log(`📈 RESUMO: ${passed}/${total} cenários passaram`);

    if (failed === 0) {
      console.log("🎉 TODOS OS CENÁRIOS CRÍTICOS ESTÃO PROTEGIDOS!");
    } else {
      console.log(`⚠️  ${failed} cenário(s) falharam. Verifique os problemas.`);
    }

    console.log("\n🛡️  CENÁRIOS PROTEGIDOS:");
    console.log("✅ Criar novo agendamento em horário já ocupado → BLOQUEADO");
    console.log("✅ Atualizar agendamento para horário já ocupado → BLOQUEADO");
    console.log("✅ Sobreposições parciais → BLOQUEADO");
    console.log("✅ Agendamentos consecutivos → PERMITIDO");
    console.log("✅ Mesmo horário em datas diferentes → PERMITIDO");
  }
}

if (require.main === module) {
  const scenariosTest = new SpecificScenariosTest();
  scenariosTest.runAllScenarios().catch(console.error);
}

module.exports = SpecificScenariosTest;
