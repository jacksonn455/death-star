const axios = require("axios");
const moment = require("moment-timezone");

/**
 * Teste avançado do sistema de agendamento
 * Valida cenários complexos e edge cases
 */
class AdvancedPlannerTest {
  constructor() {
    this.baseURL = "http://localhost:8000";
    this.results = [];
    this.createdAppointments = [];
  }

  /**
   * Teste de conectividade básica
   */
  async testBasicConnectivity() {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      
      this.results.push({
        test: "Basic Connectivity",
        status: "PASS",
        details: `Server responding on ${this.baseURL}`
      });
      
      console.log("✅ Servidor respondendo");
      return true;
    } catch (error) {
      this.results.push({
        test: "Basic Connectivity",
        status: "FAIL",
        details: `Cannot connect to ${this.baseURL}: ${error.message}`
      });
      
      console.log("❌ Servidor não está respondendo");
      return false;
    }
  }

  /**
   * Teste de conflito exato de horário
   */
  async testExactTimeConflict() {
    const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");
    
    // Criar primeiro agendamento
    const firstAppointment = {
      paciente: "Ana Silva",
      service: "Consulta",
      contact: "11999999999",
      responsible: "Dr. Maria",
      notes: "Primeira consulta",
      date: tomorrow,
      time: "10:00"
    };

    try {
      const response1 = await axios.post(`${this.baseURL}/agenda`, firstAppointment);
      this.createdAppointments.push(response1.data._id);
      
      // Tentar criar segundo agendamento no mesmo horário
      const secondAppointment = {
        paciente: "João Santos",
        service: "Retorno",
        contact: "11888888888",
        responsible: "Dr. João",
        notes: "Retorno mensal",
        date: tomorrow,
        time: "10:00" // Mesmo horário
      };

      try {
        await axios.post(`${this.baseURL}/agenda`, secondAppointment);
        
        this.results.push({
          test: "Exact Time Conflict",
          status: "FAIL",
          details: "Conflito exato de horário não foi detectado"
        });
        
        console.log("❌ Conflito exato de horário não foi detectado");
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;
          if (errorMessage.includes("Já existe um agendamento")) {
            this.results.push({
              test: "Exact Time Conflict",
              status: "PASS",
              details: "Conflito exato de horário detectado corretamente"
            });
            
            console.log("✅ Conflito exato de horário detectado corretamente");
            return true;
          }
        }
        
        this.results.push({
          test: "Exact Time Conflict",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`
        });
        
        console.log("❌ Erro inesperado no teste de conflito exato");
        return false;
      }
    } catch (error) {
      this.results.push({
        test: "Exact Time Conflict",
        status: "FAIL",
        details: `Erro ao criar primeiro agendamento: ${error.message}`
      });
      
      console.log("❌ Falha ao criar primeiro agendamento");
      return false;
    }
  }

  /**
   * Teste de agendamentos consecutivos (deve funcionar)
   */
  async testConsecutiveAppointments() {
    const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");
    
    const appointments = [
      {
        paciente: "Maria Costa",
        service: "Avaliação",
        contact: "11777777777",
        responsible: "Dr. Ana",
        notes: "Avaliação inicial",
        date: tomorrow,
        time: "14:00"
      },
      {
        paciente: "Pedro Lima",
        service: "Consulta",
        contact: "11666666666",
        responsible: "Dr. Carlos",
        notes: "Consulta de rotina",
        date: tomorrow,
        time: "15:00"
      },
      {
        paciente: "Lucia Ferreira",
        service: "Procedimento",
        contact: "11555555555",
        responsible: "Dr. Paula",
        notes: "Procedimento especial",
        date: tomorrow,
        time: "16:00"
      }
    ];

    let successCount = 0;
    const totalAppointments = appointments.length;

    for (const appointment of appointments) {
      try {
        const response = await axios.post(`${this.baseURL}/agenda`, appointment);
        this.createdAppointments.push(response.data._id);
        successCount++;
        console.log(`✅ Agendamento consecutivo criado: ${appointment.time}`);
      } catch (error) {
        console.log(`❌ Falha ao criar agendamento consecutivo ${appointment.time}: ${error.message}`);
      }
    }

    if (successCount === totalAppointments) {
      this.results.push({
        test: "Consecutive Appointments",
        status: "PASS",
        details: `${successCount}/${totalAppointments} agendamentos consecutivos criados`
      });
      
      console.log("✅ Todos os agendamentos consecutivos criados com sucesso");
      return true;
    } else {
      this.results.push({
        test: "Consecutive Appointments",
        status: "FAIL",
        details: `${successCount}/${totalAppointments} agendamentos consecutivos criados`
      });
      
      console.log(`❌ Apenas ${successCount}/${totalAppointments} agendamentos consecutivos criados`);
      return false;
    }
  }

  /**
   * Teste de agendamentos em datas diferentes (deve funcionar)
   */
  async testDifferentDatesAppointments() {
    const appointments = [
      {
        paciente: "Carlos Oliveira",
        service: "Consulta",
        contact: "11444444444",
        responsible: "Dr. Roberto",
        notes: "Consulta de rotina",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "09:00"
      },
      {
        paciente: "Ana Santos",
        service: "Retorno",
        contact: "11333333333",
        responsible: "Dr. Maria",
        notes: "Retorno mensal",
        date: moment().add(2, "day").format("YYYY-MM-DD"),
        time: "09:00" // Mesmo horário, data diferente
      },
      {
        paciente: "João Costa",
        service: "Avaliação",
        contact: "11222222222",
        responsible: "Dr. Ana",
        notes: "Avaliação inicial",
        date: moment().add(3, "day").format("YYYY-MM-DD"),
        time: "09:00" // Mesmo horário, data diferente
      }
    ];

    let successCount = 0;
    const totalAppointments = appointments.length;

    for (const appointment of appointments) {
      try {
        const response = await axios.post(`${this.baseURL}/agenda`, appointment);
        this.createdAppointments.push(response.data._id);
        successCount++;
        console.log(`✅ Agendamento em data diferente criado: ${appointment.date} às ${appointment.time}`);
      } catch (error) {
        console.log(`❌ Falha ao criar agendamento em data diferente ${appointment.date}: ${error.message}`);
      }
    }

    if (successCount === totalAppointments) {
      this.results.push({
        test: "Different Dates Appointments",
        status: "PASS",
        details: `${successCount}/${totalAppointments} agendamentos em datas diferentes criados`
      });
      
      console.log("✅ Todos os agendamentos em datas diferentes criados com sucesso");
      return true;
    } else {
      this.results.push({
        test: "Different Dates Appointments",
        status: "FAIL",
        details: `${successCount}/${totalAppointments} agendamentos em datas diferentes criados`
      });
      
      console.log(`❌ Apenas ${successCount}/${totalAppointments} agendamentos em datas diferentes criados`);
      return false;
    }
  }

  /**
   * Teste de validação de formato de data
   */
  async testDateFormatValidation() {
    const invalidDates = [
      { date: "2024-13-01", description: "Mês inválido" },
      { date: "2024-12-32", description: "Dia inválido" },
      { date: "2024/12/01", description: "Formato inválido (/) " },
      { date: "01-12-2024", description: "Formato inválido (DD-MM-YYYY)" },
      { date: "2024-12-1", description: "Dia sem zero à esquerda" },
      { date: "2024-1-01", description: "Mês sem zero à esquerda" },
      { date: "2024-12-01T10:00", description: "Formato com timestamp" },
      { date: "", description: "Data vazia" },
      { date: null, description: "Data nula" }
    ];

    let passedTests = 0;
    const totalTests = invalidDates.length;

    for (const testCase of invalidDates) {
      try {
        const appointment = {
          paciente: "Teste Validação",
          service: "Consulta",
          contact: "11111111111",
          responsible: "Dr. Teste",
          notes: "Teste de validação",
          date: testCase.date,
          time: "10:00"
        };

        await axios.post(`${this.baseURL}/agenda`, appointment);
        
        this.results.push({
          test: `Date Format: ${testCase.description}`,
          status: "FAIL",
          details: "Data inválida foi aceita"
        });
        
        console.log(`❌ Validação de data falhou: ${testCase.description}`);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.results.push({
            test: `Date Format: ${testCase.description}`,
            status: "PASS",
            details: `Validação correta: ${error.response.data.error}`
          });
          
          console.log(`✅ Validação de data passou: ${testCase.description}`);
          passedTests++;
        } else {
          this.results.push({
            test: `Date Format: ${testCase.description}`,
            status: "FAIL",
            details: `Erro inesperado: ${error.message}`
          });
          
          console.log(`❌ Erro inesperado: ${testCase.description}`);
        }
      }
    }

    return passedTests === totalTests;
  }

  /**
   * Teste de validação de formato de hora
   */
  async testTimeFormatValidation() {
    const invalidTimes = [
      { time: "25:00", description: "Hora maior que 24" },
      { time: "12:60", description: "Minuto maior que 59" },
      { time: "12:5", description: "Minuto sem zero à esquerda" },
      { time: "1:30", description: "Hora sem zero à esquerda" },
      { time: "12:30:45", description: "Formato com segundos" },
      { time: "12.30", description: "Formato com ponto" },
      { time: "12h30", description: "Formato com h" },
      { time: "", description: "Hora vazia" },
      { time: null, description: "Hora nula" }
    ];

    let passedTests = 0;
    const totalTests = invalidTimes.length;

    for (const testCase of invalidTimes) {
      try {
        const appointment = {
          paciente: "Teste Validação",
          service: "Consulta",
          contact: "11111111111",
          responsible: "Dr. Teste",
          notes: "Teste de validação",
          date: moment().add(1, "day").format("YYYY-MM-DD"),
          time: testCase.time
        };

        await axios.post(`${this.baseURL}/agenda`, appointment);
        
        this.results.push({
          test: `Time Format: ${testCase.description}`,
          status: "FAIL",
          details: "Hora inválida foi aceita"
        });
        
        console.log(`❌ Validação de hora falhou: ${testCase.description}`);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.results.push({
            test: `Time Format: ${testCase.description}`,
            status: "PASS",
            details: `Validação correta: ${error.response.data.error}`
          });
          
          console.log(`✅ Validação de hora passou: ${testCase.description}`);
          passedTests++;
        } else {
          this.results.push({
            test: `Time Format: ${testCase.description}`,
            status: "FAIL",
            details: `Erro inesperado: ${error.message}`
          });
          
          console.log(`❌ Erro inesperado: ${testCase.description}`);
        }
      }
    }

    return passedTests === totalTests;
  }

  /**
   * Teste de agendamentos em horários extremos
   */
  async testExtremeTimeAppointments() {
    const extremeTimes = [
      { time: "00:00", description: "Meia-noite" },
      { time: "23:59", description: "Último minuto" },
      { time: "08:00", description: "Primeiro horário comercial" },
      { time: "18:00", description: "Último horário comercial" },
      { time: "12:00", description: "Meio-dia" }
    ];

    let successCount = 0;
    const totalTests = extremeTimes.length;

    for (const testCase of extremeTimes) {
      try {
        const appointment = {
          paciente: `Teste ${testCase.description}`,
          service: "Consulta",
          contact: "11111111111",
          responsible: "Dr. Teste",
          notes: `Teste de horário: ${testCase.description}`,
          date: moment().add(1, "day").format("YYYY-MM-DD"),
          time: testCase.time
        };

        const response = await axios.post(`${this.baseURL}/agenda`, appointment);
        this.createdAppointments.push(response.data._id);
        successCount++;
        
        console.log(`✅ Agendamento em horário extremo criado: ${testCase.time} (${testCase.description})`);
      } catch (error) {
        console.log(`❌ Falha ao criar agendamento em horário extremo ${testCase.time}: ${error.message}`);
      }
    }

    if (successCount === totalTests) {
      this.results.push({
        test: "Extreme Time Appointments",
        status: "PASS",
        details: `${successCount}/${totalTests} agendamentos em horários extremos criados`
      });
      
      console.log("✅ Todos os agendamentos em horários extremos criados com sucesso");
      return true;
    } else {
      this.results.push({
        test: "Extreme Time Appointments",
        status: "FAIL",
        details: `${successCount}/${totalTests} agendamentos em horários extremos criados`
      });
      
      console.log(`❌ Apenas ${successCount}/${totalTests} agendamentos em horários extremos criados`);
      return false;
    }
  }

  /**
   * Teste de atualização com conflito
   */
  async testUpdateWithConflict() {
    if (this.createdAppointments.length < 2) {
      this.results.push({
        test: "Update With Conflict",
        status: "SKIP",
        details: "Pelo menos 2 agendamentos necessários para o teste"
      });
      
      console.log("⏭️  Teste de atualização com conflito pulado");
      return true;
    }

    try {
      // Pegar dois agendamentos existentes
      const appointment1Id = this.createdAppointments[0];
      const appointment2Id = this.createdAppointments[1];

      // Buscar detalhes dos agendamentos
      const response1 = await axios.get(`${this.baseURL}/agenda/${appointment1Id}`);
      const response2 = await axios.get(`${this.baseURL}/agenda/${appointment2Id}`);

      const appointment1 = response1.data;
      const appointment2 = response2.data;

      // Tentar atualizar o segundo agendamento para o mesmo horário do primeiro
      const updateData = {
        date: appointment1.date,
        time: appointment1.time
      };

      try {
        await axios.put(`${this.baseURL}/agenda/${appointment2Id}`, updateData);
        
        this.results.push({
          test: "Update With Conflict",
          status: "FAIL",
          details: "Conflito na atualização não foi detectado"
        });
        
        console.log("❌ Conflito na atualização não foi detectado");
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;
          if (errorMessage.includes("Já existe um agendamento")) {
            this.results.push({
              test: "Update With Conflict",
              status: "PASS",
              details: "Conflito na atualização detectado corretamente"
            });
            
            console.log("✅ Conflito na atualização detectado corretamente");
            return true;
          }
        }
        
        this.results.push({
          test: "Update With Conflict",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`
        });
        
        console.log("❌ Erro inesperado no teste de atualização com conflito");
        return false;
      }
    } catch (error) {
      this.results.push({
        test: "Update With Conflict",
        status: "FAIL",
        details: `Erro ao buscar agendamentos: ${error.message}`
      });
      
      console.log("❌ Falha ao buscar agendamentos para teste de conflito");
      return false;
    }
  }

  /**
   * Limpeza dos dados de teste
   */
  async cleanup() {
    console.log("🧹 Limpando dados de teste avançado...");
    
    for (const appointmentId of this.createdAppointments) {
      try {
        await axios.delete(`${this.baseURL}/agenda/${appointmentId}`);
      } catch (error) {
        console.log(`⚠️  Não foi possível excluir agendamento ${appointmentId}: ${error.message}`);
      }
    }
    
    console.log("✅ Limpeza concluída");
  }

  /**
   * Executar todos os testes avançados
   */
  async runAllTests() {
    console.log("🚀 Iniciando testes avançados do sistema de agendamento...\n");

    // Teste de conectividade
    const isConnected = await this.testBasicConnectivity();
    if (!isConnected) {
      console.log("❌ Servidor não está disponível. Abortando testes.");
      return;
    }

    // Testes avançados
    await this.testExactTimeConflict();
    await this.testConsecutiveAppointments();
    await this.testDifferentDatesAppointments();
    await this.testDateFormatValidation();
    await this.testTimeFormatValidation();
    await this.testExtremeTimeAppointments();
    await this.testUpdateWithConflict();

    // Limpeza
    await this.cleanup();

    this.printResults();
  }

  /**
   * Imprimir resultados
   */
  printResults() {
    console.log("\n📊 RESULTADOS DOS TESTES AVANÇADOS DE AGENDAMENTO:");
    console.log("=".repeat(60));

    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;
    const skipped = this.results.filter((r) => r.status === "SKIP").length;
    const total = this.results.length;

    this.results.forEach((result) => {
      let icon = "❌";
      if (result.status === "PASS") icon = "✅";
      if (result.status === "SKIP") icon = "⏭️";
      
      console.log(`${icon} ${result.test}: ${result.status}`);
      console.log(`   ${result.details}`);
      console.log("");
    });

    console.log("=".repeat(60));
    console.log(`📈 RESUMO: ${passed}/${total} testes passaram`);

    if (failed === 0) {
      console.log("🎉 Sistema de agendamento funcionando perfeitamente em cenários avançados!");
    } else {
      console.log(`⚠️  ${failed} teste(s) falharam. Verifique os problemas.`);
    }

    if (skipped > 0) {
      console.log(`⏭️  ${skipped} teste(s) foram pulados.`);
    }
  }
}

if (require.main === module) {
  const advancedPlannerTest = new AdvancedPlannerTest();
  advancedPlannerTest.runAllTests().catch(console.error);
}

module.exports = AdvancedPlannerTest; 