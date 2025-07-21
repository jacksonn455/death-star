const axios = require("axios");
const moment = require("moment-timezone");

/**
 * Teste específico para validação de sobreposições parciais
 * Valida cenários onde agendamentos se sobrepõem parcialmente
 */
class OverlapTest {
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
        details: `Server responding on ${this.baseURL}`,
      });

      console.log("✅ Servidor respondendo");
      return true;
    } catch (error) {
      this.results.push({
        test: "Basic Connectivity",
        status: "FAIL",
        details: `Cannot connect to ${this.baseURL}: ${error.message}`,
      });

      console.log("❌ Servidor não está respondendo");
      return false;
    }
  }

  /**
   * Teste de sobreposição parcial - agendamento anterior termina durante o novo
   */
  async testOverlapPreviousEndsDuringNew() {
    const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");

    const firstAppointment = {
      paciente: "Ana Silva",
      service: "Consulta",
      contact: "11999999999",
      responsible: "Dr. Maria",
      notes: "Primeira consulta",
      date: tomorrow,
      time: "10:00",
    };

    try {
      const response1 = await axios.post(
        `${this.baseURL}/agenda`,
        firstAppointment
      );
      this.createdAppointments.push(response1.data._id);

      const secondAppointment = {
        paciente: "João Santos",
        service: "Retorno",
        contact: "11888888888",
        responsible: "Dr. João",
        notes: "Retorno mensal",
        date: tomorrow,
        time: "10:30",
      };

      try {
        await axios.post(`${this.baseURL}/agenda`, secondAppointment);

        this.results.push({
          test: "Overlap: Previous Ends During New",
          status: "FAIL",
          details: "Sobreposição parcial não foi detectada",
        });

        console.log("❌ Sobreposição parcial não foi detectada");
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;
          if (
            errorMessage.includes("sobreposição") ||
            errorMessage.includes("Já existe um agendamento")
          ) {
            this.results.push({
              test: "Overlap: Previous Ends During New",
              status: "PASS",
              details: "Sobreposição parcial detectada corretamente",
            });

            console.log("✅ Sobreposição parcial detectada corretamente");
            return true;
          }
        }

        this.results.push({
          test: "Overlap: Previous Ends During New",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });

        console.log("❌ Erro inesperado no teste de sobreposição");
        return false;
      }
    } catch (error) {
      this.results.push({
        test: "Overlap: Previous Ends During New",
        status: "FAIL",
        details: `Erro ao criar primeiro agendamento: ${error.message}`,
      });

      console.log("❌ Falha ao criar primeiro agendamento");
      return false;
    }
  }

  /**
   * Teste de sobreposição parcial - novo agendamento termina durante o anterior
   */
  async testOverlapNewEndsDuringPrevious() {
    const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");

    const firstAppointment = {
      paciente: "Maria Costa",
      service: "Avaliação",
      contact: "11777777777",
      responsible: "Dr. Ana",
      notes: "Avaliação inicial",
      date: tomorrow,
      time: "14:00",
    };

    try {
      const response1 = await axios.post(
        `${this.baseURL}/agenda`,
        firstAppointment
      );
      this.createdAppointments.push(response1.data._id);

      const secondAppointment = {
        paciente: "Pedro Lima",
        service: "Consulta",
        contact: "11666666666",
        responsible: "Dr. Carlos",
        notes: "Consulta de rotina",
        date: tomorrow,
        time: "13:30",
      };

      try {
        await axios.post(`${this.baseURL}/agenda`, secondAppointment);

        this.results.push({
          test: "Overlap: New Ends During Previous",
          status: "FAIL",
          details: "Sobreposição parcial não foi detectada",
        });

        console.log("❌ Sobreposição parcial não foi detectada");
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;
          if (
            errorMessage.includes("sobreposição") ||
            errorMessage.includes("Já existe um agendamento")
          ) {
            this.results.push({
              test: "Overlap: New Ends During Previous",
              status: "PASS",
              details: "Sobreposição parcial detectada corretamente",
            });

            console.log("✅ Sobreposição parcial detectada corretamente");
            return true;
          }
        }

        this.results.push({
          test: "Overlap: New Ends During Previous",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });

        console.log("❌ Erro inesperado no teste de sobreposição");
        return false;
      }
    } catch (error) {
      this.results.push({
        test: "Overlap: New Ends During Previous",
        status: "FAIL",
        details: `Erro ao criar primeiro agendamento: ${error.message}`,
      });

      console.log("❌ Falha ao criar primeiro agendamento");
      return false;
    }
  }

  /**
   * Teste de sobreposição completa - novo agendamento dentro do anterior
   */
  async testOverlapNewInsidePrevious() {
    const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");

    const firstAppointment = {
      paciente: "Lucia Ferreira",
      service: "Procedimento",
      contact: "11555555555",
      responsible: "Dr. Paula",
      notes: "Procedimento especial",
      date: tomorrow,
      time: "16:00",
    };

    try {
      const response1 = await axios.post(
        `${this.baseURL}/agenda`,
        firstAppointment
      );
      this.createdAppointments.push(response1.data._id);

      const secondAppointment = {
        paciente: "Carlos Oliveira",
        service: "Consulta",
        contact: "11444444444",
        responsible: "Dr. Roberto",
        notes: "Consulta de rotina",
        date: tomorrow,
        time: "16:15",
      };

      try {
        await axios.post(`${this.baseURL}/agenda`, secondAppointment);

        this.results.push({
          test: "Overlap: New Inside Previous",
          status: "FAIL",
          details: "Sobreposição completa não foi detectada",
        });

        console.log("❌ Sobreposição completa não foi detectada");
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;
          if (
            errorMessage.includes("sobreposição") ||
            errorMessage.includes("Já existe um agendamento")
          ) {
            this.results.push({
              test: "Overlap: New Inside Previous",
              status: "PASS",
              details: "Sobreposição completa detectada corretamente",
            });

            console.log("✅ Sobreposição completa detectada corretamente");
            return true;
          }
        }

        this.results.push({
          test: "Overlap: New Inside Previous",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });

        console.log("❌ Erro inesperado no teste de sobreposição");
        return false;
      }
    } catch (error) {
      this.results.push({
        test: "Overlap: New Inside Previous",
        status: "FAIL",
        details: `Erro ao criar primeiro agendamento: ${error.message}`,
      });

      console.log("❌ Falha ao criar primeiro agendamento");
      return false;
    }
  }

  /**
   * Teste de sobreposição completa - agendamento anterior dentro do novo
   */
  async testOverlapPreviousInsideNew() {
    const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");

    const firstAppointment = {
      paciente: "Ana Santos",
      service: "Retorno",
      contact: "11333333333",
      responsible: "Dr. Maria",
      notes: "Retorno mensal",
      date: tomorrow,
      time: "18:00",
    };

    try {
      const response1 = await axios.post(
        `${this.baseURL}/agenda`,
        firstAppointment
      );
      this.createdAppointments.push(response1.data._id);

      const secondAppointment = {
        paciente: "João Costa",
        service: "Avaliação",
        contact: "11222222222",
        responsible: "Dr. Ana",
        notes: "Avaliação inicial",
        date: tomorrow,
        time: "17:30",
      };

      try {
        await axios.post(`${this.baseURL}/agenda`, secondAppointment);

        this.results.push({
          test: "Overlap: Previous Inside New",
          status: "FAIL",
          details: "Sobreposição completa não foi detectada",
        });

        console.log("❌ Sobreposição completa não foi detectada");
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;
          if (
            errorMessage.includes("sobreposição") ||
            errorMessage.includes("Já existe um agendamento")
          ) {
            this.results.push({
              test: "Overlap: Previous Inside New",
              status: "PASS",
              details: "Sobreposição completa detectada corretamente",
            });

            console.log("✅ Sobreposição completa detectada corretamente");
            return true;
          }
        }

        this.results.push({
          test: "Overlap: Previous Inside New",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });

        console.log("❌ Erro inesperado no teste de sobreposição");
        return false;
      }
    } catch (error) {
      this.results.push({
        test: "Overlap: Previous Inside New",
        status: "FAIL",
        details: `Erro ao criar primeiro agendamento: ${error.message}`,
      });

      console.log("❌ Falha ao criar primeiro agendamento");
      return false;
    }
  }

  /**
   * Teste de agendamentos consecutivos válidos (deve funcionar)
   */
  async testValidConsecutiveAppointments() {
    const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");

    const appointments = [
      {
        paciente: "Maria Silva",
        service: "Consulta",
        contact: "11111111111",
        responsible: "Dr. Teste",
        notes: "Consulta 1",
        date: tomorrow,
        time: "09:00",
      },
      {
        paciente: "João Silva",
        service: "Consulta",
        contact: "11111111112",
        responsible: "Dr. Teste",
        notes: "Consulta 2",
        date: tomorrow,
        time: "10:00",
      },
      {
        paciente: "Pedro Silva",
        service: "Consulta",
        contact: "11111111113",
        responsible: "Dr. Teste",
        notes: "Consulta 3",
        date: tomorrow,
        time: "11:00",
      },
    ];

    let successCount = 0;
    const totalAppointments = appointments.length;

    for (const appointment of appointments) {
      try {
        const response = await axios.post(
          `${this.baseURL}/agenda`,
          appointment
        );
        this.createdAppointments.push(response.data._id);
        successCount++;
        console.log(
          `✅ Agendamento consecutivo válido criado: ${appointment.time}`
        );
      } catch (error) {
        console.log(
          `❌ Falha ao criar agendamento consecutivo válido ${appointment.time}: ${error.message}`
        );
      }
    }

    if (successCount === totalAppointments) {
      this.results.push({
        test: "Valid Consecutive Appointments",
        status: "PASS",
        details: `${successCount}/${totalAppointments} agendamentos consecutivos válidos criados`,
      });

      console.log(
        "✅ Todos os agendamentos consecutivos válidos criados com sucesso"
      );
      return true;
    } else {
      this.results.push({
        test: "Valid Consecutive Appointments",
        status: "FAIL",
        details: `${successCount}/${totalAppointments} agendamentos consecutivos válidos criados`,
      });

      console.log(
        `❌ Apenas ${successCount}/${totalAppointments} agendamentos consecutivos válidos criados`
      );
      return false;
    }
  }

  /**
   * Teste de atualização com sobreposição
   */
  async testUpdateWithOverlap() {
    if (this.createdAppointments.length < 2) {
      this.results.push({
        test: "Update With Overlap",
        status: "SKIP",
        details: "Pelo menos 2 agendamentos necessários para o teste",
      });

      console.log("⏭️  Teste de atualização com sobreposição pulado");
      return true;
    }

    try {
      const appointment1Id = this.createdAppointments[0];
      const appointment2Id = this.createdAppointments[1];

      const response1 = await axios.get(
        `${this.baseURL}/agenda/${appointment1Id}`
      );
      const response2 = await axios.get(
        `${this.baseURL}/agenda/${appointment2Id}`
      );

      const appointment1 = response1.data;
      const appointment2 = response2.data;

      const appointment1Start = moment.tz(
        `${appointment1.date}T${appointment1.time}`,
        "America/Sao_Paulo"
      );
      const overlapTime = appointment1Start
        .clone()
        .add(30, "minutes")
        .format("HH:mm");

      const updateData = {
        date: appointment1.date,
        time: overlapTime,
      };

      try {
        await axios.put(`${this.baseURL}/agenda/${appointment2Id}`, updateData);

        this.results.push({
          test: "Update With Overlap",
          status: "FAIL",
          details: "Sobreposição na atualização não foi detectada",
        });

        console.log("❌ Sobreposição na atualização não foi detectada");
        return false;
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;
          if (
            errorMessage.includes("sobreposição") ||
            errorMessage.includes("Já existe um agendamento")
          ) {
            this.results.push({
              test: "Update With Overlap",
              status: "PASS",
              details: "Sobreposição na atualização detectada corretamente",
            });

            console.log(
              "✅ Sobreposição na atualização detectada corretamente"
            );
            return true;
          }
        }

        this.results.push({
          test: "Update With Overlap",
          status: "FAIL",
          details: `Erro inesperado: ${error.message}`,
        });

        console.log(
          "❌ Erro inesperado no teste de atualização com sobreposição"
        );
        return false;
      }
    } catch (error) {
      this.results.push({
        test: "Update With Overlap",
        status: "FAIL",
        details: `Erro ao buscar agendamentos: ${error.message}`,
      });

      console.log("❌ Falha ao buscar agendamentos para teste de sobreposição");
      return false;
    }
  }

  /**
   * Limpeza dos dados de teste
   */
  async cleanup() {
    console.log("🧹 Limpando dados de teste de sobreposição...");

    for (const appointmentId of this.createdAppointments) {
      try {
        await axios.delete(`${this.baseURL}/agenda/${appointmentId}`);
      } catch (error) {
        console.log(
          `⚠️  Não foi possível excluir agendamento ${appointmentId}: ${error.message}`
        );
      }
    }

    console.log("✅ Limpeza concluída");
  }

  /**
   * Executar todos os testes de sobreposição
   */
  async runAllTests() {
    console.log(
      "🚀 Iniciando testes de sobreposição do sistema de agendamento...\n"
    );

    const isConnected = await this.testBasicConnectivity();
    if (!isConnected) {
      console.log("❌ Servidor não está disponível. Abortando testes.");
      return;
    }

    await this.testOverlapPreviousEndsDuringNew();
    await this.testOverlapNewEndsDuringPrevious();
    await this.testOverlapNewInsidePrevious();
    await this.testOverlapPreviousInsideNew();
    await this.testValidConsecutiveAppointments();
    await this.testUpdateWithOverlap();

    await this.cleanup();

    this.printResults();
  }

  /**
   * Imprimir resultados
   */
  printResults() {
    console.log("\n📊 RESULTADOS DOS TESTES DE SOBREPOSIÇÃO:");
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
      console.log(
        "🎉 Sistema de agendamento funcionando perfeitamente em cenários de sobreposição!"
      );
    } else {
      console.log(`⚠️  ${failed} teste(s) falharam. Verifique os problemas.`);
    }

    if (skipped > 0) {
      console.log(`⏭️  ${skipped} teste(s) foram pulados.`);
    }
  }
}

if (require.main === module) {
  const overlapTest = new OverlapTest();
  overlapTest.runAllTests().catch(console.error);
}

module.exports = OverlapTest;
