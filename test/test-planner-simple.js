const axios = require("axios");
const moment = require("moment-timezone");

/**
 * Teste simples do sistema de agendamento
 * Foca apenas nas validações básicas sem Google Calendar
 */
class SimplePlannerTest {
  constructor() {
    this.baseURL = "http://localhost:8000";
    this.results = [];
    this.createdAppointments = [];
    this.accessToken = null;
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
   * Autenticação para obter token
   */
  async authenticate() {
    try {
      const loginData = {
        email: "admin@test.com",
        password: "admin123"
      };

      const response = await axios.post(`${this.baseURL}/auth/login`, loginData);
      
      if (response.status === 200 && response.data.accessToken) {
        this.accessToken = response.data.accessToken;
        
        this.results.push({
          test: "Authentication",
          status: "PASS",
          details: "Token obtido com sucesso"
        });
        
        console.log("✅ Autenticação realizada com sucesso");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Authentication",
        status: "FAIL",
        details: `Erro na autenticação: ${error.message}`
      });
      
      console.log("❌ Falha na autenticação");
      return false;
    }
  }

  /**
   * Configurar headers de autorização
   */
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Teste de criação de agendamento válido
   */
  async testValidAppointmentCreation() {
    try {
      const appointmentData = {
        paciente: "João Silva",
        service: "Consulta",
        contact: "11999999999",
        responsible: "Dr. Maria",
        notes: "Primeira consulta",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "14:00"
      };

      const response = await axios.post(
        `${this.baseURL}/agenda`, 
        appointmentData,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        
        this.results.push({
          test: "Valid Appointment Creation",
          status: "PASS",
          details: `Agendamento criado com ID: ${response.data._id}`
        });
        
        console.log("✅ Agendamento válido criado com sucesso");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Valid Appointment Creation",
        status: "FAIL",
        details: `Erro ao criar agendamento válido: ${error.message}`
      });
      
      console.log("❌ Falha ao criar agendamento válido");
      return false;
    }
  }

  /**
   * Teste de conflito de horário (mesma data e hora)
   */
  async testTimeConflict() {
    try {
      const conflictingAppointment = {
        paciente: "Maria Santos",
        service: "Retorno",
        contact: "11888888888",
        responsible: "Dr. João",
        notes: "Retorno mensal",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "14:00" // Mesmo horário do primeiro
      };

      const response = await axios.post(
        `${this.baseURL}/agenda`, 
        conflictingAppointment,
        { headers: this.getAuthHeaders() }
      );
      
      // Se chegou aqui, o teste falhou porque deveria ter rejeitado
      this.results.push({
        test: "Time Conflict Prevention",
        status: "FAIL",
        details: "Agendamento conflitante foi aceito quando deveria ser rejeitado"
      });
      
      console.log("❌ Conflito de horário não foi detectado");
      return false;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error;
        if (errorMessage.includes("Já existe um agendamento")) {
          this.results.push({
            test: "Time Conflict Prevention",
            status: "PASS",
            details: "Conflito de horário detectado corretamente"
          });
          
          console.log("✅ Conflito de horário detectado corretamente");
          return true;
        }
      }
      
      this.results.push({
        test: "Time Conflict Prevention",
        status: "FAIL",
        details: `Erro inesperado: ${error.message}`
      });
      
      console.log("❌ Erro inesperado no teste de conflito");
      return false;
    }
  }

  /**
   * Teste de agendamento em horário diferente (deve funcionar)
   */
  async testDifferentTimeAppointment() {
    try {
      const differentTimeAppointment = {
        paciente: "Pedro Costa",
        service: "Avaliação",
        contact: "11777777777",
        responsible: "Dr. Ana",
        notes: "Avaliação inicial",
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        time: "15:00" // Horário diferente
      };

      const response = await axios.post(
        `${this.baseURL}/agenda`, 
        differentTimeAppointment,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201 && response.data._id) {
        this.createdAppointments.push(response.data._id);
        
        this.results.push({
          test: "Different Time Appointment",
          status: "PASS",
          details: `Agendamento em horário diferente criado: ${response.data.time}`
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
        details: `Erro ao criar agendamento em horário diferente: ${error.message}`
      });
      
      console.log("❌ Falha ao criar agendamento em horário diferente");
      return false;
    }
  }

  /**
   * Teste de busca de agendamentos
   */
  async testGetAppointments() {
    try {
      const response = await axios.get(
        `${this.baseURL}/agenda`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200 && response.data.data) {
        this.results.push({
          test: "Get Appointments",
          status: "PASS",
          details: `${response.data.data.length} agendamentos encontrados`
        });
        
        console.log("✅ Busca de agendamentos funcionando");
        return true;
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error) {
      this.results.push({
        test: "Get Appointments",
        status: "FAIL",
        details: `Erro ao buscar agendamentos: ${error.message}`
      });
      
      console.log("❌ Falha ao buscar agendamentos");
      return false;
    }
  }

  /**
   * Teste de exclusão de agendamento
   */
  async testDeleteAppointment() {
    if (this.createdAppointments.length === 0) {
      this.results.push({
        test: "Delete Appointment",
        status: "SKIP",
        details: "Nenhum agendamento criado para excluir"
      });
      
      console.log("⏭️  Teste de exclusão pulado");
      return true;
    }

    try {
      const appointmentId = this.createdAppointments[0];
      const response = await axios.delete(
        `${this.baseURL}/agenda/${appointmentId}`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 204) {
        this.results.push({
          test: "Delete Appointment",
          status: "PASS",
          details: "Agendamento excluído com sucesso"
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
        details: `Erro ao excluir agendamento: ${error.message}`
      });
      
      console.log("❌ Falha ao excluir agendamento");
      return false;
    }
  }

  /**
   * Limpeza dos dados de teste
   */
  async cleanup() {
    console.log("🧹 Limpando dados de teste...");
    
    for (const appointmentId of this.createdAppointments) {
      try {
        await axios.delete(
          `${this.baseURL}/agenda/${appointmentId}`,
          { headers: this.getAuthHeaders() }
        );
      } catch (error) {
        console.log(`⚠️  Não foi possível excluir agendamento ${appointmentId}: ${error.message}`);
      }
    }
    
    console.log("✅ Limpeza concluída");
  }

  /**
   * Executar todos os testes
   */
  async runAllTests() {
    console.log("🚀 Iniciando testes simples do sistema de agendamento...\n");

    // Teste de conectividade
    const isConnected = await this.testBasicConnectivity();
    if (!isConnected) {
      console.log("❌ Servidor não está disponível. Abortando testes.");
      return;
    }

    // Autenticação
    const isAuthenticated = await this.authenticate();
    if (!isAuthenticated) {
      console.log("❌ Falha na autenticação. Abortando testes.");
      return;
    }

    // Testes básicos
    await this.testValidAppointmentCreation();
    await this.testTimeConflict();
    await this.testDifferentTimeAppointment();
    await this.testGetAppointments();
    await this.testDeleteAppointment();

    // Limpeza
    await this.cleanup();

    this.printResults();
  }

  /**
   * Imprimir resultados
   */
  printResults() {
    console.log("\n📊 RESULTADOS DOS TESTES SIMPLES DE AGENDAMENTO:");
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
      console.log("🎉 Sistema de agendamento funcionando perfeitamente!");
    } else {
      console.log(`⚠️  ${failed} teste(s) falharam. Verifique os problemas.`);
    }

    if (skipped > 0) {
      console.log(`⏭️  ${skipped} teste(s) foram pulados.`);
    }
  }
}

if (require.main === module) {
  const simpleTest = new SimplePlannerTest();
  simpleTest.runAllTests().catch(console.error);
}

module.exports = SimplePlannerTest; 