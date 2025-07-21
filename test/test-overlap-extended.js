const axios = require("axios");
const moment = require("moment-timezone");

/**
 * Teste específico para validação de sobreposições com endDate/endTime
 * Valida todos os cenários de sobreposição com agendamentos que têm data/hora de término
 */
class ExtendedOverlapTest {
  constructor() {
    this.baseURL = "http://localhost:8000";
    this.results = [];
    this.createdAppointments = [];
    this.authToken = "";
    this.testDate = moment().add(1, "day").format("YYYY-MM-DD");
  }

  async authenticate() {
    try {
      const loginResponse = await axios.post(`${this.baseURL}/auth/login`, {
        email: "test@example.com",
        password: "test123",
      });
      this.authToken = loginResponse.data.accessToken;
      console.log("✅ Autenticação realizada com sucesso");
      return true;
    } catch (error) {
      console.log("❌ Erro na autenticação:", error.response?.data || error.message);
      return false;
    }
  }

  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.authToken}`,
      "Content-Type": "application/json",
    };
  }

  async runAllTests() {
    console.log("🧪 Iniciando testes de sobreposição estendidos...\n");

    // Autenticar primeiro
    const authSuccess = await this.authenticate();
    if (!authSuccess) {
      console.log("❌ Falha na autenticação. Testes abortados.");
      return;
    }

    await this.testExactOverlapWithEndTime();
    await this.testPartialOverlapStartBeforeEnd();
    await this.testPartialOverlapEndAfterStart();
    await this.testCompleteOverlapNewInsideExisting();
    await this.testCompleteOverlapExistingInsideNew();
    await this.testConsecutiveAppointmentsWithEndTime();
    await this.testCrossDayAppointments();
    await this.testShortAppointmentOverlap();
    await this.testMixedDurationAppointments();
    await this.testUpdateWithOverlap();

    this.printResults();
  }

  async testExactOverlapWithEndTime() {
    try {
      const appointment1 = {
        paciente: "Paciente 1",
        service: "Consulta 1",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Primeiro agendamento",
        date: this.testDate,
        time: "10:00",
        endDate: this.testDate,
        endTime: "12:00",
      };

      const appointment2 = {
        paciente: "Paciente 2",
        service: "Consulta 2",
        contact: "22222222222",
        responsible: "Dr. Teste",
        notes: "Segundo agendamento - mesmo horário",
        date: this.testDate,
        time: "10:00",
        endDate: this.testDate,
        endTime: "12:00",
      };

      const response1 = await axios.post(`${this.baseURL}/agenda`, appointment1, {
        headers: this.getAuthHeaders()
      });
      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento criado");

      const response2 = await axios.post(`${this.baseURL}/agenda`, appointment2, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Exact Overlap with End Time",
        status: "FAIL",
        details: "Deveria ter falhado devido à sobreposição exata",
      });
      console.log("❌ Sobreposição exata foi permitida");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Exact Overlap with End Time",
          status: "PASS",
          details: "Sobreposição exata detectada corretamente",
        });
        console.log("✅ Sobreposição exata detectada corretamente");
        return true;
      } else {
        this.results.push({
          test: "Exact Overlap with End Time",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de sobreposição exata");
        return false;
      }
    }
  }

  async testPartialOverlapStartBeforeEnd() {
    try {
      const appointment1 = {
        paciente: "Paciente 3",
        service: "Consulta 3",
        contact: "33333333333",
        responsible: "Dr. Teste",
        notes: "Agendamento das 14:00 às 16:00",
        date: this.testDate,
        time: "14:00",
        endDate: this.testDate,
        endTime: "16:00",
      };

      const appointment2 = {
        paciente: "Paciente 4",
        service: "Consulta 4",
        contact: "44444444444",
        responsible: "Dr. Teste",
        notes: "Agendamento das 15:00 às 17:00 (sobrepõe)",
        date: this.testDate,
        time: "15:00",
        endDate: this.testDate,
        endTime: "17:00",
      };

      const response1 = await axios.post(`${this.baseURL}/agenda`, appointment1, {
        headers: this.getAuthHeaders()
      });
      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento criado (14:00-16:00)");

      const response2 = await axios.post(`${this.baseURL}/agenda`, appointment2, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Partial Overlap Start Before End",
        status: "FAIL",
        details: "Deveria ter falhado devido à sobreposição parcial",
      });
      console.log("❌ Sobreposição parcial foi permitida");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Partial Overlap Start Before End",
          status: "PASS",
          details: "Sobreposição parcial detectada corretamente",
        });
        console.log("✅ Sobreposição parcial detectada corretamente");
        return true;
      } else {
        this.results.push({
          test: "Partial Overlap Start Before End",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de sobreposição parcial");
        return false;
      }
    }
  }

  async testPartialOverlapEndAfterStart() {
    try {
      const appointment1 = {
        paciente: "Paciente 5",
        service: "Consulta 5",
        contact: "55555555555",
        responsible: "Dr. Teste",
        notes: "Agendamento das 18:00 às 20:00",
        date: this.testDate,
        time: "18:00",
        endDate: this.testDate,
        endTime: "20:00",
      };

      const appointment2 = {
        paciente: "Paciente 6",
        service: "Consulta 6",
        contact: "66666666666",
        responsible: "Dr. Teste",
        notes: "Agendamento das 17:00 às 19:00 (sobrepõe)",
        date: this.testDate,
        time: "17:00",
        endDate: this.testDate,
        endTime: "19:00",
      };

      const response1 = await axios.post(`${this.baseURL}/agenda`, appointment1, {
        headers: this.getAuthHeaders()
      });
      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento criado (18:00-20:00)");

      const response2 = await axios.post(`${this.baseURL}/agenda`, appointment2, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Partial Overlap End After Start",
        status: "FAIL",
        details: "Deveria ter falhado devido à sobreposição parcial",
      });
      console.log("❌ Sobreposição parcial foi permitida");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Partial Overlap End After Start",
          status: "PASS",
          details: "Sobreposição parcial detectada corretamente",
        });
        console.log("✅ Sobreposição parcial detectada corretamente");
        return true;
      } else {
        this.results.push({
          test: "Partial Overlap End After Start",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de sobreposição parcial");
        return false;
      }
    }
  }

  async testCompleteOverlapNewInsideExisting() {
    try {
      const appointment1 = {
        paciente: "Paciente 7",
        service: "Consulta 7",
        contact: "77777777777",
        responsible: "Dr. Teste",
        notes: "Agendamento das 09:00 às 12:00",
        date: this.testDate,
        time: "09:00",
        endDate: this.testDate,
        endTime: "12:00",
      };

      const appointment2 = {
        paciente: "Paciente 8",
        service: "Consulta 8",
        contact: "88888888888",
        responsible: "Dr. Teste",
        notes: "Agendamento das 10:00 às 11:00 (dentro do primeiro)",
        date: this.testDate,
        time: "10:00",
        endDate: this.testDate,
        endTime: "11:00",
      };

      const response1 = await axios.post(`${this.baseURL}/agenda`, appointment1, {
        headers: this.getAuthHeaders()
      });
      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento criado (09:00-12:00)");

      const response2 = await axios.post(`${this.baseURL}/agenda`, appointment2, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Complete Overlap New Inside Existing",
        status: "FAIL",
        details: "Deveria ter falhado devido à sobreposição completa",
      });
      console.log("❌ Sobreposição completa foi permitida");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Complete Overlap New Inside Existing",
          status: "PASS",
          details: "Sobreposição completa detectada corretamente",
        });
        console.log("✅ Sobreposição completa detectada corretamente");
        return true;
      } else {
        this.results.push({
          test: "Complete Overlap New Inside Existing",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de sobreposição completa");
        return false;
      }
    }
  }

  async testCompleteOverlapExistingInsideNew() {
    try {
      const appointment1 = {
        paciente: "Paciente 9",
        service: "Consulta 9",
        contact: "99999999999",
        responsible: "Dr. Teste",
        notes: "Agendamento das 13:00 às 14:00",
        date: this.testDate,
        time: "13:00",
        endDate: this.testDate,
        endTime: "14:00",
      };

      const appointment2 = {
        paciente: "Paciente 10",
        service: "Consulta 10",
        contact: "10101010101",
        responsible: "Dr. Teste",
        notes: "Agendamento das 12:00 às 15:00 (engloba o primeiro)",
        date: this.testDate,
        time: "12:00",
        endDate: this.testDate,
        endTime: "15:00",
      };

      const response1 = await axios.post(`${this.baseURL}/agenda`, appointment1, {
        headers: this.getAuthHeaders()
      });
      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento criado (13:00-14:00)");

      const response2 = await axios.post(`${this.baseURL}/agenda`, appointment2, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Complete Overlap Existing Inside New",
        status: "FAIL",
        details: "Deveria ter falhado devido à sobreposição completa",
      });
      console.log("❌ Sobreposição completa foi permitida");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Complete Overlap Existing Inside New",
          status: "PASS",
          details: "Sobreposição completa detectada corretamente",
        });
        console.log("✅ Sobreposição completa detectada corretamente");
        return true;
      } else {
        this.results.push({
          test: "Complete Overlap Existing Inside New",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de sobreposição completa");
        return false;
      }
    }
  }

  async testConsecutiveAppointmentsWithEndTime() {
    try {
      const appointments = [
        {
          paciente: "Paciente 11",
          service: "Consulta 11",
          contact: "11111111111",
          responsible: "Dr. Teste",
          notes: "Agendamento das 08:00 às 09:00",
          date: this.testDate,
          time: "08:00",
          endDate: this.testDate,
          endTime: "09:00",
        },
        {
          paciente: "Paciente 12",
          service: "Consulta 12",
          contact: "12121212121",
          responsible: "Dr. Teste",
          notes: "Agendamento das 09:00 às 10:00",
          date: this.testDate,
          time: "09:00",
          endDate: this.testDate,
          endTime: "10:00",
        },
        {
          paciente: "Paciente 13",
          service: "Consulta 13",
          contact: "13131313131",
          responsible: "Dr. Teste",
          notes: "Agendamento das 10:00 às 11:00",
          date: this.testDate,
          time: "10:00",
          endDate: this.testDate,
          endTime: "11:00",
        },
      ];

      let successCount = 0;
      for (const appointment of appointments) {
        try {
          const response = await axios.post(`${this.baseURL}/agenda`, appointment, {
            headers: this.getAuthHeaders()
          });
          this.createdAppointments.push(response.data._id);
          successCount++;
          console.log(`✅ Agendamento consecutivo criado: ${appointment.time}-${appointment.endTime}`);
        } catch (error) {
          console.log(`❌ Falha ao criar agendamento consecutivo: ${error.message}`);
        }
      }

      if (successCount === appointments.length) {
        this.results.push({
          test: "Consecutive Appointments with End Time",
          status: "PASS",
          details: `${successCount}/${appointments.length} agendamentos consecutivos criados`,
        });
        console.log("✅ Todos os agendamentos consecutivos criados com sucesso");
        return true;
      } else {
        this.results.push({
          test: "Consecutive Appointments with End Time",
          status: "FAIL",
          details: `${successCount}/${appointments.length} agendamentos consecutivos criados`,
        });
        console.log(`❌ Apenas ${successCount}/${appointments.length} agendamentos consecutivos criados`);
        return false;
      }
    } catch (error) {
      this.results.push({
        test: "Consecutive Appointments with End Time",
        status: "FAIL",
        details: `Erro inesperado: ${error.message}`,
      });
      console.log("❌ Erro inesperado nos agendamentos consecutivos");
      return false;
    }
  }

  async testCrossDayAppointments() {
    try {
      const appointment1 = {
        paciente: "Paciente 14",
        service: "Consulta 14",
        contact: "14141414141",
        responsible: "Dr. Teste",
        notes: "Agendamento que cruza o dia (23:00-01:00)",
        date: this.testDate,
        time: "23:00",
        endDate: moment().add(2, "day").format("YYYY-MM-DD"),
        endTime: "01:00",
      };

      const appointment2 = {
        paciente: "Paciente 15",
        service: "Consulta 15",
        contact: "15151515151",
        responsible: "Dr. Teste",
        notes: "Agendamento que sobrepõe ao cruzar o dia",
        date: this.testDate,
        time: "23:30",
        endDate: moment().add(2, "day").format("YYYY-MM-DD"),
        endTime: "01:30",
      };

      const response1 = await axios.post(`${this.baseURL}/agenda`, appointment1, {
        headers: this.getAuthHeaders()
      });
      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento cruzando o dia criado");

      const response2 = await axios.post(`${this.baseURL}/agenda`, appointment2, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Cross Day Appointments Overlap",
        status: "FAIL",
        details: "Deveria ter falhado devido à sobreposição cruzando o dia",
      });
      console.log("❌ Sobreposição cruzando o dia foi permitida");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Cross Day Appointments Overlap",
          status: "PASS",
          details: "Sobreposição cruzando o dia detectada corretamente",
        });
        console.log("✅ Sobreposição cruzando o dia detectada corretamente");
        return true;
      } else {
        this.results.push({
          test: "Cross Day Appointments Overlap",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação cruzando o dia");
        return false;
      }
    }
  }

  async testShortAppointmentOverlap() {
    try {
      const appointment1 = {
        paciente: "Paciente 16",
        service: "Consulta 16",
        contact: "16161616161",
        responsible: "Dr. Teste",
        notes: "Agendamento curto (14:00-14:30)",
        date: this.testDate,
        time: "14:00",
        endDate: this.testDate,
        endTime: "14:30",
      };

      const appointment2 = {
        paciente: "Paciente 17",
        service: "Consulta 17",
        contact: "17171717171",
        responsible: "Dr. Teste",
        notes: "Agendamento que sobrepõe ao curto (14:15-14:45)",
        date: this.testDate,
        time: "14:15",
        endDate: this.testDate,
        endTime: "14:45",
      };

      const response1 = await axios.post(`${this.baseURL}/agenda`, appointment1, {
        headers: this.getAuthHeaders()
      });
      this.createdAppointments.push(response1.data._id);
      console.log("✅ Primeiro agendamento curto criado");

      const response2 = await axios.post(`${this.baseURL}/agenda`, appointment2, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Short Appointment Overlap",
        status: "FAIL",
        details: "Deveria ter falhado devido à sobreposição de agendamento curto",
      });
      console.log("❌ Sobreposição de agendamento curto foi permitida");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Short Appointment Overlap",
          status: "PASS",
          details: "Sobreposição de agendamento curto detectada corretamente",
        });
        console.log("✅ Sobreposição de agendamento curto detectada corretamente");
        return true;
      } else {
        this.results.push({
          test: "Short Appointment Overlap",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de agendamento curto");
        return false;
      }
    }
  }

  async testMixedDurationAppointments() {
    try {
      const appointments = [
        {
          paciente: "Paciente 18",
          service: "Consulta 18",
          contact: "18181818181",
          responsible: "Dr. Teste",
          notes: "Agendamento padrão (1 hora)",
          date: this.testDate,
          time: "16:00",
        },
        {
          paciente: "Paciente 19",
          service: "Consulta 19",
          contact: "19191919191",
          responsible: "Dr. Teste",
          notes: "Agendamento com término específico (2 horas)",
          date: this.testDate,
          time: "18:00",
          endDate: this.testDate,
          endTime: "20:00",
        },
        {
          paciente: "Paciente 20",
          service: "Consulta 20",
          contact: "20202020202",
          responsible: "Dr. Teste",
          notes: "Agendamento curto (30 minutos)",
          date: this.testDate,
          time: "21:00",
          endDate: this.testDate,
          endTime: "21:30",
        },
      ];

      let successCount = 0;
      for (const appointment of appointments) {
        try {
          const response = await axios.post(`${this.baseURL}/agenda`, appointment, {
            headers: this.getAuthHeaders()
          });
          this.createdAppointments.push(response.data._id);
          successCount++;
          console.log(`✅ Agendamento misto criado: ${appointment.time}`);
        } catch (error) {
          console.log(`❌ Falha ao criar agendamento misto: ${error.message}`);
        }
      }

      if (successCount === appointments.length) {
        this.results.push({
          test: "Mixed Duration Appointments",
          status: "PASS",
          details: `${successCount}/${appointments.length} agendamentos mistos criados`,
        });
        console.log("✅ Todos os agendamentos mistos criados com sucesso");
        return true;
      } else {
        this.results.push({
          test: "Mixed Duration Appointments",
          status: "FAIL",
          details: `${successCount}/${appointments.length} agendamentos mistos criados`,
        });
        console.log(`❌ Apenas ${successCount}/${appointments.length} agendamentos mistos criados`);
        return false;
      }
    } catch (error) {
      this.results.push({
        test: "Mixed Duration Appointments",
        status: "FAIL",
        details: `Erro inesperado: ${error.message}`,
      });
      console.log("❌ Erro inesperado nos agendamentos mistos");
      return false;
    }
  }

  async testUpdateWithOverlap() {
    try {
      const appointment1 = {
        paciente: "Paciente 21",
        service: "Consulta 21",
        contact: "21212121212",
        responsible: "Dr. Teste",
        notes: "Agendamento original",
        date: this.testDate,
        time: "22:00",
        endDate: this.testDate,
        endTime: "23:00",
      };

      const response1 = await axios.post(`${this.baseURL}/agenda`, appointment1, {
        headers: this.getAuthHeaders()
      });
      this.createdAppointments.push(response1.data._id);
      console.log("✅ Agendamento original criado");

      const updateData = {
        date: this.testDate,
        time: "22:30",
        endDate: this.testDate,
        endTime: "23:30",
        service: "Consulta Atualizada",
        paciente: "Paciente Atualizado",
        responsible: "Dr. Atualizado",
      };

      const response2 = await axios.put(
        `${this.baseURL}/agenda/${response1.data._id}`,
        updateData,
        { headers: this.getAuthHeaders() }
      );

      this.results.push({
        test: "Update with Overlap",
        status: "PASS",
        details: "Atualização com sobreposição funcionou corretamente",
      });
      console.log("✅ Atualização com sobreposição funcionou corretamente");
      return true;
    } catch (error) {
      this.results.push({
        test: "Update with Overlap",
        status: "FAIL",
        details: `Erro na atualização: ${error.message}`,
      });
      console.log("❌ Erro na atualização com sobreposição");
      return false;
    }
  }

  printResults() {
    console.log("\n📊 RESULTADOS DOS TESTES DE SOBREPOSIÇÃO:");
    console.log("=" * 50);

    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;
    const total = this.results.length;

    console.log(`✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    console.log(`📈 Total: ${total}`);
    console.log(`📊 Taxa de Sucesso: ${((passed / total) * 100).toFixed(2)}%`);

    console.log("\n📋 DETALHES DOS TESTES:");
    this.results.forEach((result, index) => {
      const status = result.status === "PASS" ? "✅" : "❌";
      console.log(`${index + 1}. ${status} ${result.test}`);
      if (result.details) {
        console.log(`   ${result.details}`);
      }
    });

    console.log("\n🧹 Limpando agendamentos de teste...");
    this.cleanupTestAppointments();
  }

  async cleanupTestAppointments() {
    for (const appointmentId of this.createdAppointments) {
      try {
        await axios.delete(`${this.baseURL}/agenda/${appointmentId}`, {
          headers: this.getAuthHeaders()
        });
        console.log(`🗑️ Agendamento ${appointmentId} excluído`);
      } catch (error) {
        console.log(`⚠️ Erro ao excluir agendamento ${appointmentId}: ${error.message}`);
      }
    }
    console.log("✅ Limpeza concluída!");
  }
}

const test = new ExtendedOverlapTest();
test.runAllTests().catch(console.error); 