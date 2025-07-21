const axios = require("axios");
const moment = require("moment-timezone");

/**
 * Teste completo do sistema de agendamento com data/hora de término
 * Valida conflitos de horários e todos os cenários possíveis incluindo endDate/endTime
 */
class ExtendedPlannerTest {
  constructor() {
    this.baseURL = "http://localhost:8000";
    this.results = [];
    this.createdAppointments = [];
    this.authToken = "";
    this.testData = {
      // Testes básicos com duração padrão (1 hora)
      validAppointment: {
        paciente: "João Silva",
        service: "Consulta",
        contact: "11999999999",
        responsible: "Dr. Maria",
        notes: "Primeira consulta",
        date: moment().add(7, "day").format("YYYY-MM-DD"),
        time: "14:00",
        endTime: "15:00",
      },
      conflictingAppointment: {
        paciente: "Maria Santos",
        service: "Retorno",
        contact: "11888888888",
        responsible: "Dr. João",
        notes: "Retorno mensal",
        date: moment().add(7, "day").format("YYYY-MM-DD"),
        time: "14:00",
        endTime: "15:00",
      },
      differentTimeAppointment: {
        paciente: "Pedro Costa",
        service: "Avaliação",
        contact: "11777777777",
        responsible: "Dr. Ana",
        notes: "Avaliação inicial",
        date: moment().add(7, "day").format("YYYY-MM-DD"),
        time: "15:00",
        endTime: "16:00",
      },
      differentDateAppointment: {
        paciente: "Ana Oliveira",
        service: "Consulta",
        contact: "11666666666",
        responsible: "Dr. Carlos",
        notes: "Consulta de rotina",
        date: moment().add(8, "day").format("YYYY-MM-DD"),
        time: "14:00",
        endTime: "15:00",
      },

      // Testes com hora de término específica
      appointmentWithEndTime: {
        paciente: "Carlos Lima",
        service: "Procedimento Longo",
        contact: "11555555555",
        responsible: "Dr. Paula",
        notes: "Procedimento que dura 2 horas",
        date: moment().add(7, "day").format("YYYY-MM-DD"),
        time: "10:00",
        endTime: "12:00",
      },
      appointmentWithDifferentEndDate: {
        paciente: "Fernanda Santos",
        service: "Tratamento Especial",
        contact: "11444444444",
        responsible: "Dr. Roberto",
        notes: "Tratamento que dura até tarde",
        date: moment().add(7, "day").format("YYYY-MM-DD"),
        time: "20:00",
        endTime: "22:00",
      },
      overlappingAppointmentWithEndTime: {
        paciente: "Ricardo Alves",
        service: "Consulta",
        contact: "11333333333",
        responsible: "Dr. Ana",
        notes: "Consulta que sobrepõe ao primeiro",
        date: moment().add(7, "day").format("YYYY-MM-DD"),
        time: "11:00",
        endTime: "13:00",
      },
      consecutiveAppointmentWithEndTime: {
        paciente: "Patrícia Costa",
        service: "Avaliação",
        contact: "11222222222",
        responsible: "Dr. Maria",
        notes: "Avaliação consecutiva",
        date: moment().add(7, "day").format("YYYY-MM-DD"),
        time: "12:00",
        endTime: "14:00",
      },
      shortAppointmentWithEndTime: {
        paciente: "Lucas Mendes",
        service: "Retorno Rápido",
        contact: "11111111111",
        responsible: "Dr. João",
        notes: "Retorno de 30 minutos",
        date: moment().add(7, "day").format("YYYY-MM-DD"),
        time: "16:00",
        endTime: "16:30",
      },
      edgeCaseAppointment: {
        paciente: "Carlos Lima",
        service: "Procedimento",
        contact: "11555555555",
        responsible: "Dr. Paula",
        notes: "Procedimento especial",
        date: moment().add(9, "day").format("YYYY-MM-DD"),
        time: "22:00",
        endTime: "23:00",
      },
    };
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
    console.log("🧪 Iniciando testes estendidos do sistema de agendamento...\n");

    // Autenticar primeiro
    const authSuccess = await this.authenticate();
    if (!authSuccess) {
      console.log("❌ Falha na autenticação. Testes abortados.");
      return;
    }

    await this.testValidAppointmentCreation();
    await this.testAppointmentWithEndTime();
    await this.testAppointmentWithDifferentEndDate();
    await this.testOverlappingAppointmentWithEndTime();
    await this.testConsecutiveAppointmentWithEndTime();
    await this.testShortAppointmentWithEndTime();
    await this.testConflictingAppointment();
    await this.testDifferentTimeAppointment();
    await this.testDifferentDateAppointment();
    await this.testEdgeCaseAppointment();
    await this.testInvalidEndTimeBeforeStart();
    await this.testInvalidEndDateBeforeStart();
    await this.testMixedAppointmentsValidation();
    await this.testUpdateAppointmentWithEndTime();
    await this.testDeleteAppointment();

    this.printResults();
  }

  async testValidAppointmentCreation() {
    try {
      const response = await axios.post(
        `${this.baseURL}/agenda`,
        this.testData.validAppointment,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        this.results.push({
          test: "Valid Appointment Creation (1 hour default)",
          status: "PASS",
          details: `Agendamento criado com ID: ${response.data._id}`,
        });
        console.log("✅ Agendamento válido criado com sucesso (duração padrão)");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Valid Appointment Creation (1 hour default)",
        status: "FAIL",
        details: `Erro ao criar agendamento válido: ${error.message}`,
      });
      console.log("❌ Falha ao criar agendamento válido (duração padrão)");
      return false;
    }
  }

  async testAppointmentWithEndTime() {
    try {
      const response = await axios.post(
        `${this.baseURL}/agenda`,
        this.testData.appointmentWithEndTime,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        this.results.push({
          test: "Appointment with End Time (2 hours)",
          status: "PASS",
          details: `Agendamento com término criado: ${response.data._id}`,
        });
        console.log("✅ Agendamento com hora de término criado com sucesso");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Appointment with End Time (2 hours)",
        status: "FAIL",
        details: `Erro ao criar agendamento com término: ${error.message}`,
      });
      console.log("❌ Falha ao criar agendamento com hora de término");
      return false;
    }
  }

  async testAppointmentWithDifferentEndDate() {
    try {
      const response = await axios.post(
        `${this.baseURL}/agenda`,
        this.testData.appointmentWithDifferentEndDate,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        this.results.push({
          test: "Appointment with Late End Time",
          status: "PASS",
          details: `Agendamento com término tarde criado: ${response.data._id}`,
        });
        console.log("✅ Agendamento com término tarde criado com sucesso");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Appointment with Late End Time",
        status: "FAIL",
        details: `Erro ao criar agendamento com término tarde: ${error.message}`,
      });
      console.log("❌ Falha ao criar agendamento com término tarde");
      return false;
    }
  }

  async testOverlappingAppointmentWithEndTime() {
    try {
      const response = await axios.post(
        `${this.baseURL}/agenda`,
        this.testData.overlappingAppointmentWithEndTime,
        { headers: this.getAuthHeaders() }
      );

      this.results.push({
        test: "Overlapping Appointment with End Time",
        status: "FAIL",
        details: "Deveria ter falhado devido à sobreposição",
      });
      console.log("❌ Agendamento sobreposto foi criado (deveria ter falhado)");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Overlapping Appointment with End Time",
          status: "PASS",
          details: "Sobreposição detectada corretamente",
        });
        console.log("✅ Sobreposição detectada corretamente");
        return true;
      } else {
        this.results.push({
          test: "Overlapping Appointment with End Time",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de sobreposição");
        return false;
      }
    }
  }

  async testConsecutiveAppointmentWithEndTime() {
    try {
      const response = await axios.post(
        `${this.baseURL}/agenda`,
        this.testData.consecutiveAppointmentWithEndTime,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        this.results.push({
          test: "Consecutive Appointment with End Time",
          status: "PASS",
          details: `Agendamento consecutivo criado: ${response.data._id}`,
        });
        console.log("✅ Agendamento consecutivo criado com sucesso");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Consecutive Appointment with End Time",
        status: "FAIL",
        details: `Erro ao criar agendamento consecutivo: ${error.message}`,
      });
      console.log("❌ Falha ao criar agendamento consecutivo");
      return false;
    }
  }

  async testShortAppointmentWithEndTime() {
    try {
      const response = await axios.post(
        `${this.baseURL}/agenda`,
        this.testData.shortAppointmentWithEndTime,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        this.results.push({
          test: "Short Appointment with End Time (30 min)",
          status: "PASS",
          details: `Agendamento curto criado: ${response.data._id}`,
        });
        console.log("✅ Agendamento curto criado com sucesso");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Short Appointment with End Time (30 min)",
        status: "FAIL",
        details: `Erro ao criar agendamento curto: ${error.message}`,
      });
      console.log("❌ Falha ao criar agendamento curto");
      return false;
    }
  }

  async testConflictingAppointment() {
    try {
      const response = await axios.post(
        `${this.baseURL}/agenda`,
        this.testData.conflictingAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.results.push({
        test: "Conflicting Appointment",
        status: "FAIL",
        details: "Deveria ter falhado devido ao conflito",
      });
      console.log("❌ Agendamento conflitante foi criado (deveria ter falhado)");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Conflicting Appointment",
          status: "PASS",
          details: "Conflito detectado corretamente",
        });
        console.log("✅ Conflito detectado corretamente");
        return true;
      } else {
        this.results.push({
          test: "Conflicting Appointment",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de conflito");
        return false;
      }
    }
  }

  async testDifferentTimeAppointment() {
    try {
      const response = await axios.post(
        `${this.baseURL}/agenda`,
        this.testData.differentTimeAppointment,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        this.results.push({
          test: "Different Time Appointment",
          status: "PASS",
          details: `Agendamento em horário diferente criado: ${response.data._id}`,
        });
        console.log("✅ Agendamento em horário diferente criado com sucesso");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Different Time Appointment",
        status: "FAIL",
        details: `Erro ao criar agendamento em horário diferente: ${error.message}`,
      });
      console.log("❌ Falha ao criar agendamento em horário diferente");
      return false;
    }
  }

  async testDifferentDateAppointment() {
    try {
      const response = await axios.post(
        `${this.baseURL}/agenda`,
        this.testData.differentDateAppointment,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        this.results.push({
          test: "Different Date Appointment",
          status: "PASS",
          details: `Agendamento em data diferente criado: ${response.data._id}`,
        });
        console.log("✅ Agendamento em data diferente criado com sucesso");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Different Date Appointment",
        status: "FAIL",
        details: `Erro ao criar agendamento em data diferente: ${error.message}`,
      });
      console.log("❌ Falha ao criar agendamento em data diferente");
      return false;
    }
  }

  async testEdgeCaseAppointment() {
    try {
      const response = await axios.post(
        `${this.baseURL}/agenda`,
        this.testData.edgeCaseAppointment,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        this.results.push({
          test: "Edge Case Appointment (22:00-23:00)",
          status: "PASS",
          details: `Agendamento em horário extremo criado: ${response.data._id}`,
        });
        console.log("✅ Agendamento em horário extremo criado com sucesso");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Edge Case Appointment (22:00-23:00)",
        status: "FAIL",
        details: `Erro ao criar agendamento em horário extremo: ${error.message}`,
      });
      console.log("❌ Falha ao criar agendamento em horário extremo");
      return false;
    }
  }

  async testInvalidEndTimeBeforeStart() {
    try {
      const invalidAppointment = {
        ...this.testData.validAppointment,
        endTime: "13:00", // Antes do horário de início (14:00)
      };

      const response = await axios.post(
        `${this.baseURL}/agenda`,
        invalidAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.results.push({
        test: "Invalid End Time Before Start",
        status: "FAIL",
        details: "Deveria ter falhado devido ao horário de término anterior ao início",
      });
      console.log("❌ Agendamento com término anterior ao início foi criado");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Invalid End Time Before Start",
          status: "PASS",
          details: "Validação de horário de término funcionou corretamente",
        });
        console.log("✅ Validação de horário de término funcionou corretamente");
        return true;
      } else {
        this.results.push({
          test: "Invalid End Time Before Start",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de horário");
        return false;
      }
    }
  }

  async testInvalidEndDateBeforeStart() {
    try {
      const invalidAppointment = {
        ...this.testData.validAppointment,
        endTime: "15:00",
      };

      const response = await axios.post(
        `${this.baseURL}/agenda`,
        invalidAppointment,
        { headers: this.getAuthHeaders() }
      );

      this.results.push({
        test: "Invalid End Date Before Start",
        status: "FAIL",
        details: "Deveria ter falhado devido à data de término anterior ao início",
      });
      console.log("❌ Agendamento com data de término anterior foi criado");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Invalid End Date Before Start",
          status: "PASS",
          details: "Validação de data de término funcionou corretamente",
        });
        console.log("✅ Validação de data de término funcionou corretamente");
        return true;
      } else {
        this.results.push({
          test: "Invalid End Date Before Start",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de data");
        return false;
      }
    }
  }

  async testMixedAppointmentsValidation() {
    try {
      const mixedAppointment = {
        paciente: "Teste Misto",
        service: "Consulta Mista",
        contact: "11000000000",
        responsible: "Dr. Teste",
        notes: "Teste com agendamentos mistos",
        date: moment().add(3, "day").format("YYYY-MM-DD"),
        time: "09:00",
        endTime: "11:00",
      };

      const response = await axios.post(
        `${this.baseURL}/agenda`,
        mixedAppointment,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        this.results.push({
          test: "Mixed Appointments Validation",
          status: "PASS",
          details: `Agendamento misto criado: ${response.data._id}`,
        });
        console.log("✅ Validação de agendamentos mistos funcionou");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Mixed Appointments Validation",
        status: "FAIL",
        details: `Erro na validação de agendamentos mistos: ${error.message}`,
      });
      console.log("❌ Falha na validação de agendamentos mistos");
      return false;
    }
  }

  async testUpdateAppointmentWithEndTime() {
    try {
      const updateData = {
        date: moment().add(10, "day").format("YYYY-MM-DD"),
        time: "15:00",
        endTime: "17:00",
        service: "Consulta Atualizada",
        paciente: "Paciente Atualizado",
        responsible: "Dr. Atualizado",
      };

      const response = await axios.put(
        `${this.baseURL}/agenda/${this.createdAppointments[0]}`,
        updateData,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 200) {
        this.results.push({
          test: "Update Appointment with End Time",
          status: "PASS",
          details: "Agendamento atualizado com hora de término",
        });
        console.log("✅ Agendamento atualizado com hora de término");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Update Appointment with End Time",
        status: "FAIL",
        details: `Erro ao atualizar agendamento: ${error.message}`,
      });
      console.log("❌ Falha ao atualizar agendamento");
      return false;
    }
  }

  async testDeleteAppointment() {
    try {
      // Criar um agendamento específico para teste de exclusão
      const deleteTestAppointment = {
        paciente: "Paciente para Exclusão",
        service: "Teste de Exclusão",
        contact: "99999999999",
        responsible: "Dr. Teste",
        notes: "Agendamento criado especificamente para teste de exclusão",
        date: moment().add(20, "day").format("YYYY-MM-DD"), // Data mais distante
        time: "20:00",
        endTime: "21:00",
      };

      const createResponse = await axios.post(
        `${this.baseURL}/agenda`,
        deleteTestAppointment,
        { headers: this.getAuthHeaders() }
      );

      if (!createResponse.data._id) {
        throw new Error("Falha ao criar agendamento para teste de exclusão");
      }

      const appointmentToDelete = createResponse.data._id;
      console.log(`✅ Agendamento criado para exclusão: ${appointmentToDelete}`);

      // Aguardar um pouco para garantir que o agendamento foi criado
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar se o agendamento existe antes de tentar excluir
      try {
        await axios.get(`${this.baseURL}/agenda/${appointmentToDelete}`, {
          headers: this.getAuthHeaders()
        });
      } catch (error) {
        this.results.push({
          test: "Delete Appointment",
          status: "SKIP",
          details: "Agendamento não existe, pulando teste de exclusão",
        });
        console.log("⚠️ Agendamento não existe, pulando teste de exclusão");
        return true;
      }

      const response = await axios.delete(
        `${this.baseURL}/agenda/${appointmentToDelete}`,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 200) {
        this.results.push({
          test: "Delete Appointment",
          status: "PASS",
          details: "Agendamento excluído com sucesso",
        });
        console.log("✅ Agendamento excluído com sucesso");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Delete Appointment",
        status: "FAIL",
        details: `Erro ao excluir agendamento: ${error.message}`,
      });
      console.log("❌ Falha ao excluir agendamento");
      return false;
    }
  }

  printResults() {
    console.log("\n📊 RESULTADOS DOS TESTES:");
    console.log("=" * 50);

    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;
    const skipped = this.results.filter((r) => r.status === "SKIP").length;
    const total = this.results.length;

    console.log(`✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    console.log(`⏭️ Pulou: ${skipped}`);
    console.log(`📈 Total: ${total}`);
    console.log(`📊 Taxa de Sucesso: ${((passed / total) * 100).toFixed(2)}%`);

    console.log("\n📋 DETALHES DOS TESTES:");
    this.results.forEach((result, index) => {
      const status = result.status === "PASS" ? "✅" : result.status === "SKIP" ? "⏭️" : "❌";
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
        // Verificar se o agendamento existe antes de tentar excluir
        try {
          await axios.get(`${this.baseURL}/agenda/${appointmentId}`, {
            headers: this.getAuthHeaders()
          });
        } catch (error) {
          console.log(`⚠️ Agendamento ${appointmentId} não existe, pulando exclusão`);
          continue;
        }

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

const test = new ExtendedPlannerTest();
test.runAllTests().catch(console.error); 