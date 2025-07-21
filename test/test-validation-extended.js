const axios = require("axios");
const moment = require("moment-timezone");

/**
 * Teste específico para validação de dados inválidos com endDate/endTime
 * Valida formatos incorretos, datas inválidas, horários inválidos, etc.
 */
class ExtendedValidationTest {
  constructor() {
    this.baseURL = "http://localhost:8000";
    this.results = [];
    this.createdAppointments = [];
    this.authToken = "";
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
    console.log("🧪 Iniciando testes de validação estendidos...\n");

    // Autenticar primeiro
    const authSuccess = await this.authenticate();
    if (!authSuccess) {
      console.log("❌ Falha na autenticação. Testes abortados.");
      return;
    }

    await this.testInvalidDateFormat();
    await this.testInvalidTimeFormat();
    await this.testInvalidEndDateFormat();
    await this.testInvalidEndTimeFormat();
    await this.testEndTimeBeforeStartTime();
    await this.testEndDateBeforeStartDate();
    await this.testEndTimeSameAsStartTime();
    await this.testMissingRequiredFields();
    await this.testInvalidDateValues();
    await this.testInvalidTimeValues();
    await this.testInvalidEndDateValues();
    await this.testInvalidEndTimeValues();
    await this.testCrossDayValidation();
    await this.testValidAppointments();

    this.printResults();
  }

  async testInvalidDateFormat() {
    try {
      const invalidAppointment = {
        paciente: "Paciente Teste",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Teste com data inválida",
        date: "2024-13-45", // Data inválida
        time: "14:00",
      };

      const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Invalid Date Format",
        status: "FAIL",
        details: "Deveria ter falhado devido ao formato de data inválido",
      });
      console.log("❌ Data inválida foi aceita");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Invalid Date Format",
          status: "PASS",
          details: "Formato de data inválido rejeitado corretamente",
        });
        console.log("✅ Formato de data inválido rejeitado corretamente");
        return true;
      } else {
        this.results.push({
          test: "Invalid Date Format",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de data");
        return false;
      }
    }
  }

  async testInvalidTimeFormat() {
    try {
      const invalidAppointment = {
        paciente: "Paciente Teste",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Teste com hora inválida",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "25:70", // Hora inválida
      };

      const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Invalid Time Format",
        status: "FAIL",
        details: "Deveria ter falhado devido ao formato de hora inválido",
      });
      console.log("❌ Hora inválida foi aceita");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Invalid Time Format",
          status: "PASS",
          details: "Formato de hora inválido rejeitado corretamente",
        });
        console.log("✅ Formato de hora inválido rejeitado corretamente");
        return true;
      } else {
        this.results.push({
          test: "Invalid Time Format",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de hora");
        return false;
      }
    }
  }

  async testInvalidEndDateFormat() {
    try {
      const invalidAppointment = {
        paciente: "Paciente Teste",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Teste com data de término inválida",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "14:00",
        endDate: "2024-13-45", // Data inválida
        endTime: "15:00",
      };

      const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Invalid End Date Format",
        status: "FAIL",
        details: "Deveria ter falhado devido ao formato de data de término inválido",
      });
      console.log("❌ Data de término inválida foi aceita");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Invalid End Date Format",
          status: "PASS",
          details: "Formato de data de término inválido rejeitado corretamente",
        });
        console.log("✅ Formato de data de término inválido rejeitado corretamente");
        return true;
      } else {
        this.results.push({
          test: "Invalid End Date Format",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de data de término");
        return false;
      }
    }
  }

  async testInvalidEndTimeFormat() {
    try {
      const invalidAppointment = {
        paciente: "Paciente Teste",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Teste com hora de término inválida",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "14:00",
        endDate: moment().add(1, "day").format("YYYY-MM-DD"),
        endTime: "25:70", // Hora inválida
      };

      const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "Invalid End Time Format",
        status: "FAIL",
        details: "Deveria ter falhado devido ao formato de hora de término inválido",
      });
      console.log("❌ Hora de término inválida foi aceita");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "Invalid End Time Format",
          status: "PASS",
          details: "Formato de hora de término inválido rejeitado corretamente",
        });
        console.log("✅ Formato de hora de término inválido rejeitado corretamente");
        return true;
      } else {
        this.results.push({
          test: "Invalid End Time Format",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de hora de término");
        return false;
      }
    }
  }

  async testEndTimeBeforeStartTime() {
    try {
      const invalidAppointment = {
        paciente: "Paciente Teste",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Teste com hora de término anterior à de início",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "14:00",
        endDate: moment().add(1, "day").format("YYYY-MM-DD"),
        endTime: "13:00", // Antes do horário de início (14:00)
      };

      const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "End Time Before Start Time",
        status: "FAIL",
        details: "Deveria ter falhado devido ao horário de término anterior ao início",
      });
      console.log("❌ Hora de término anterior foi aceita");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "End Time Before Start Time",
          status: "PASS",
          details: "Horário de término anterior rejeitado corretamente",
        });
        console.log("✅ Horário de término anterior rejeitado corretamente");
        return true;
      } else {
        this.results.push({
          test: "End Time Before Start Time",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de horário");
        return false;
      }
    }
  }

  async testEndDateBeforeStartDate() {
    try {
      const invalidAppointment = {
        paciente: "Paciente Teste",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Teste com data de término anterior à de início",
        date: moment().add(2, "day").format("YYYY-MM-DD"),
        time: "14:00",
        endDate: moment().format("YYYY-MM-DD"), // Data anterior
        endTime: "15:00",
      };

      const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "End Date Before Start Date",
        status: "FAIL",
        details: "Deveria ter falhado devido à data de término anterior ao início",
      });
      console.log("❌ Data de término anterior foi aceita");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "End Date Before Start Date",
          status: "PASS",
          details: "Data de término anterior rejeitada corretamente",
        });
        console.log("✅ Data de término anterior rejeitada corretamente");
        return true;
      } else {
        this.results.push({
          test: "End Date Before Start Date",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de data");
        return false;
      }
    }
  }

  async testEndTimeSameAsStartTime() {
    try {
      const invalidAppointment = {
        paciente: "Paciente Teste",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Teste com hora de término igual à de início",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "14:00",
        endDate: moment().add(1, "day").format("YYYY-MM-DD"),
        endTime: "14:00", // Mesmo horário
      };

      const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
        headers: this.getAuthHeaders()
      });
      this.results.push({
        test: "End Time Same as Start Time",
        status: "FAIL",
        details: "Deveria ter falhado devido ao horário de término igual ao início",
      });
      console.log("❌ Hora de término igual foi aceita");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.results.push({
          test: "End Time Same as Start Time",
          status: "PASS",
          details: "Horário de término igual rejeitado corretamente",
        });
        console.log("✅ Horário de término igual rejeitado corretamente");
        return true;
      } else {
        this.results.push({
          test: "End Time Same as Start Time",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });
        console.log("❌ Erro inesperado na validação de horário igual");
        return false;
      }
    }
  }

  async testMissingRequiredFields() {
    const requiredFields = ["date", "time", "paciente"];
    
    for (const field of requiredFields) {
      try {
        const invalidAppointment = {
          paciente: "Paciente Teste",
          service: "Consulta",
          contact: "11111111111",
          responsible: "Dr. Teste",
          notes: "Teste com campo obrigatório ausente",
          date: moment().add(1, "day").format("YYYY-MM-DD"),
          time: "14:00",
        };
        
        delete invalidAppointment[field];

        const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
          headers: this.getAuthHeaders()
        });
        this.results.push({
          test: `Missing Required Field: ${field}`,
          status: "FAIL",
          details: `Campo obrigatório '${field}' ausente foi aceito`,
        });
        console.log(`❌ Campo obrigatório '${field}' ausente foi aceito`);
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.results.push({
            test: `Missing Required Field: ${field}`,
            status: "PASS",
            details: `Campo obrigatório '${field}' ausente rejeitado corretamente`,
          });
          console.log(`✅ Campo obrigatório '${field}' ausente rejeitado corretamente`);
        } else {
          this.results.push({
            test: `Missing Required Field: ${field}`,
            status: "FAIL",
            details: `Erro inesperado: ${error.message}`,
          });
          console.log(`❌ Erro inesperado na validação do campo '${field}'`);
          return false;
        }
      }
    }
    return true;
  }

  async testInvalidDateValues() {
    const invalidDates = [
      "2024-02-30", // Dia inexistente
      "2024-04-31", // Dia inexistente
      "2024-13-01", // Mês inexistente
      "2024-00-01", // Mês inexistente
      "2024-12-00", // Dia inexistente
    ];

    for (const invalidDate of invalidDates) {
      try {
        const invalidAppointment = {
          paciente: "Paciente Teste",
          service: "Consulta",
          contact: "11111111111",
          responsible: "Dr. Teste",
          notes: "Teste com data inválida",
          date: invalidDate,
          time: "14:00",
        };

        const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
          headers: this.getAuthHeaders()
        });
        this.results.push({
          test: `Invalid Date Value: ${invalidDate}`,
          status: "FAIL",
          details: `Data inválida '${invalidDate}' foi aceita`,
        });
        console.log(`❌ Data inválida '${invalidDate}' foi aceita`);
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.results.push({
            test: `Invalid Date Value: ${invalidDate}`,
            status: "PASS",
            details: `Data inválida '${invalidDate}' rejeitada corretamente`,
          });
          console.log(`✅ Data inválida '${invalidDate}' rejeitada corretamente`);
        } else {
          this.results.push({
            test: `Invalid Date Value: ${invalidDate}`,
            status: "FAIL",
            details: `Erro inesperado: ${error.message}`,
          });
          console.log(`❌ Erro inesperado na validação da data '${invalidDate}'`);
          return false;
        }
      }
    }
    return true;
  }

  async testInvalidTimeValues() {
    const invalidTimes = [
      "24:00", // Hora inválida
      "25:00", // Hora inválida
      "12:60", // Minuto inválido
      "12:99", // Minuto inválido
      "12:0",  // Formato inválido
      "12:",   // Formato inválido
      ":30",   // Formato inválido
    ];

    for (const invalidTime of invalidTimes) {
      try {
        const invalidAppointment = {
          paciente: "Paciente Teste",
          service: "Consulta",
          contact: "11111111111",
          responsible: "Dr. Teste",
          notes: "Teste com hora inválida",
          date: moment().add(1, "day").format("YYYY-MM-DD"),
          time: invalidTime,
        };

        const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
          headers: this.getAuthHeaders()
        });
        this.results.push({
          test: `Invalid Time Value: ${invalidTime}`,
          status: "FAIL",
          details: `Hora inválida '${invalidTime}' foi aceita`,
        });
        console.log(`❌ Hora inválida '${invalidTime}' foi aceita`);
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.results.push({
            test: `Invalid Time Value: ${invalidTime}`,
            status: "PASS",
            details: `Hora inválida '${invalidTime}' rejeitada corretamente`,
          });
          console.log(`✅ Hora inválida '${invalidTime}' rejeitada corretamente`);
        } else {
          this.results.push({
            test: `Invalid Time Value: ${invalidTime}`,
            status: "FAIL",
            details: `Erro inesperado: ${error.message}`,
          });
          console.log(`❌ Erro inesperado na validação da hora '${invalidTime}'`);
          return false;
        }
      }
    }
    return true;
  }

  async testInvalidEndDateValues() {
    const invalidEndDates = [
      "2024-02-30", // Dia inexistente
      "2024-04-31", // Dia inexistente
      "2024-13-01", // Mês inexistente
      "2024-00-01", // Mês inexistente
      "2024-12-00", // Dia inexistente
    ];

    for (const invalidEndDate of invalidEndDates) {
      try {
        const invalidAppointment = {
          paciente: "Paciente Teste",
          service: "Consulta",
          contact: "11111111111",
          responsible: "Dr. Teste",
          notes: "Teste com data de término inválida",
          date: moment().add(1, "day").format("YYYY-MM-DD"),
          time: "14:00",
          endDate: invalidEndDate,
          endTime: "15:00",
        };

        const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
          headers: this.getAuthHeaders()
        });
        this.results.push({
          test: `Invalid End Date Value: ${invalidEndDate}`,
          status: "FAIL",
          details: `Data de término inválida '${invalidEndDate}' foi aceita`,
        });
        console.log(`❌ Data de término inválida '${invalidEndDate}' foi aceita`);
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.results.push({
            test: `Invalid End Date Value: ${invalidEndDate}`,
            status: "PASS",
            details: `Data de término inválida '${invalidEndDate}' rejeitada corretamente`,
          });
          console.log(`✅ Data de término inválida '${invalidEndDate}' rejeitada corretamente`);
        } else {
          this.results.push({
            test: `Invalid End Date Value: ${invalidEndDate}`,
            status: "FAIL",
            details: `Erro inesperado: ${error.message}`,
          });
          console.log(`❌ Erro inesperado na validação da data de término '${invalidEndDate}'`);
          return false;
        }
      }
    }
    return true;
  }

  async testInvalidEndTimeValues() {
    const invalidEndTimes = [
      "24:00", // Hora inválida
      "25:00", // Hora inválida
      "12:60", // Minuto inválido
      "12:99", // Minuto inválido
      "12:0",  // Formato inválido
      "12:",   // Formato inválido
      ":30",   // Formato inválido
    ];

    for (const invalidEndTime of invalidEndTimes) {
      try {
        const invalidAppointment = {
          paciente: "Paciente Teste",
          service: "Consulta",
          contact: "11111111111",
          responsible: "Dr. Teste",
          notes: "Teste com hora de término inválida",
          date: moment().add(1, "day").format("YYYY-MM-DD"),
          time: "14:00",
          endDate: moment().add(1, "day").format("YYYY-MM-DD"),
          endTime: invalidEndTime,
        };

        const response = await axios.post(`${this.baseURL}/agenda`, invalidAppointment, {
          headers: this.getAuthHeaders()
        });
        this.results.push({
          test: `Invalid End Time Value: ${invalidEndTime}`,
          status: "FAIL",
          details: `Hora de término inválida '${invalidEndTime}' foi aceita`,
        });
        console.log(`❌ Hora de término inválida '${invalidEndTime}' foi aceita`);
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.results.push({
            test: `Invalid End Time Value: ${invalidEndTime}`,
            status: "PASS",
            details: `Hora de término inválida '${invalidEndTime}' rejeitada corretamente`,
          });
          console.log(`✅ Hora de término inválida '${invalidEndTime}' rejeitada corretamente`);
        } else {
          this.results.push({
            test: `Invalid End Time Value: ${invalidEndTime}`,
            status: "FAIL",
            details: `Erro inesperado: ${error.message}`,
          });
          console.log(`❌ Erro inesperado na validação da hora de término '${invalidEndTime}'`);
          return false;
        }
      }
    }
    return true;
  }

  async testCrossDayValidation() {
    try {
      const validCrossDayAppointment = {
        paciente: "Paciente Teste",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Teste com agendamento cruzando o dia",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "23:00",
        endDate: moment().add(2, "day").format("YYYY-MM-DD"),
        endTime: "01:00",
      };

      const response = await axios.post(`${this.baseURL}/agenda`, validCrossDayAppointment, {
        headers: this.getAuthHeaders()
      });
      this.createdAppointments.push(response.data._id);
      this.results.push({
        test: "Cross Day Validation",
        status: "PASS",
        details: "Agendamento cruzando o dia criado com sucesso",
      });
      console.log("✅ Agendamento cruzando o dia criado com sucesso");
      return true;
    } catch (error) {
      this.results.push({
        test: "Cross Day Validation",
        status: "FAIL",
        details: `Erro ao criar agendamento cruzando o dia: ${error.message}`,
      });
      console.log("❌ Erro ao criar agendamento cruzando o dia");
      return false;
    }
  }

  async testValidAppointments() {
    const validAppointments = [
      {
        paciente: "Paciente Válido 1",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Agendamento padrão (1 hora)",
        date: moment().add(3, "day").format("YYYY-MM-DD"),
        time: "10:00",
      },
      {
        paciente: "Paciente Válido 2",
        service: "Consulta",
        contact: "22222222222",
        responsible: "Dr. Teste",
        notes: "Agendamento com término específico",
        date: moment().add(3, "day").format("YYYY-MM-DD"),
        time: "14:00",
        endDate: moment().add(3, "day").format("YYYY-MM-DD"),
        endTime: "16:00",
      },
      {
        paciente: "Paciente Válido 3",
        service: "Consulta",
        contact: "33333333333",
        responsible: "Dr. Teste",
        notes: "Agendamento curto",
        date: moment().add(3, "day").format("YYYY-MM-DD"),
        time: "18:00",
        endDate: moment().add(3, "day").format("YYYY-MM-DD"),
        endTime: "18:30",
      },
    ];

    let successCount = 0;
    for (const appointment of validAppointments) {
      try {
        const response = await axios.post(`${this.baseURL}/agenda`, appointment, {
          headers: this.getAuthHeaders()
        });
        this.createdAppointments.push(response.data._id);
        successCount++;
        console.log(`✅ Agendamento válido criado: ${appointment.paciente}`);
      } catch (error) {
        console.log(`❌ Falha ao criar agendamento válido: ${error.message}`);
      }
    }

    if (successCount === validAppointments.length) {
      this.results.push({
        test: "Valid Appointments",
        status: "PASS",
        details: `${successCount}/${validAppointments.length} agendamentos válidos criados`,
      });
      console.log("✅ Todos os agendamentos válidos criados com sucesso");
      return true;
    } else {
      this.results.push({
        test: "Valid Appointments",
        status: "FAIL",
        details: `${successCount}/${validAppointments.length} agendamentos válidos criados`,
      });
      console.log(`❌ Apenas ${successCount}/${validAppointments.length} agendamentos válidos criados`);
      return false;
    }
  }

  printResults() {
    console.log("\n📊 RESULTADOS DOS TESTES DE VALIDAÇÃO:");
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

const test = new ExtendedValidationTest();
test.runAllTests().catch(console.error); 