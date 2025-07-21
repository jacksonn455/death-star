const axios = require("axios");
const FormData = require("form-data");

const BASE_URL = "http://localhost:8000";

async function login() {
  try {
    const loginData = {
      email: "test@example.com",
      password: "test123",
    };

    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log("Resposta do login:", response.data);
    const token = response.data.accessToken || response.data.token;
    if (!token) {
      throw new Error("Token não retornado no login");
    }
    console.log("Token obtido:", token.substring(0, 20) + "...");
    return token;
  } catch (error) {
    console.error("Erro no login:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    console.error("URL tentada:", `${BASE_URL}/auth/login`);
    throw error;
  }
}

async function createPacienteCompleto(token) {
  const formData = new FormData();

  formData.append("nome", "João Silva");
  formData.append("idade", "30");
  formData.append("dataNascimento", "1993-05-15");
  formData.append("profissao", "Engenheiro");
  formData.append("cpf", "123.456.789-00");
  formData.append("rg", "12.345.678-9");
  formData.append("contato", "(11) 99999-9999");
  formData.append("email", "joao@example.com");
  formData.append("endereco", "Rua das Flores, 123");
  formData.append("escolaridade", "Superior Completo");
  formData.append("estadoCivil", "Casado");

  formData.append("queixa", "Manchas na pele");
  formData.append("soubeDoTrabalho", "Indicação de amiga");

  formData.append("inicioQueixa", "Há 6 meses");
  formData.append("intensificacaoQueixa", "Piorou com exposição solar");
  formData.append("tratamentosAnteriores", "Usou protetor solar");
  formData.append("usoProdutos", "Protetor solar FPS 30");

  formData.append("patologias[]", "Diabetes");
  formData.append("patologias[]", "Hipertensão");

  formData.append("funcionamentoIntestinal", "Regular");
  formData.append("gestante", "Não");
  formData.append("contraceptivo", "Não usa");
  formData.append("cicloMenstrual", "Regular");
  formData.append("ultimaGestacao", "N/A");
  formData.append("qualidadeSono", "Boa");
  formData.append("ansiedade", "Ocasional");
  formData.append("nervosismo", "Raramente");
  formData.append("exercicio", "3x por semana");

  formData.append("tabagista", "Não");
  formData.append("alcool", "3x na semana");
  formData.append("covid", "Sim");
  formData.append("sequelas", "Fadiga ocasional");
  formData.append("alergias", "Pólen");
  formData.append("suplementacao", "Sim");
  formData.append("suplementacaoDescricao", "Vitamina D, Ômega 3");
  formData.append("refeicoes", "5x ao dia");
  formData.append("carne", "3x na semana");
  formData.append("lanches", "1x na semana");
  formData.append("refrigerante", "Não ingere");
  formData.append("frutas", "Todos os dias");
  formData.append("leite", "Duas vezes ao dia");
  formData.append("madrugada", "Não");
  formData.append("ultimoHorario", "22:00");
  formData.append("horarioDorme", "23:30");
  formData.append("intolerancia", "Lactose");

  formData.append("melasma", "Misto");
  formData.append("manchas[]", "Solares");
  formData.append("manchas[]", "Hormonais");
  formData.append("linhas[]", "Testa");
  formData.append("linhas[]", "Ao redor dos olhos");
  formData.append("acne", "Apresenta");
  formData.append("grau", "Grau II");
  formData.append("regiaoAcne[]", "Testa");
  formData.append("regiaoAcne[]", "Queixo");
  formData.append("cicatriz", "Apresenta");
  formData.append("tipoCicatriz[]", "Boxcar");
  formData.append("tipoCicatriz[]", "Ice Pick");
  formData.append("olheiras", "Apresenta");
  formData.append("tipoOlheiras[]", "Estrutural");
  formData.append("tipoOlheiras[]", "Vascular");

  formData.append("tratamento[diagnostico]", "Melasma e Acne");
  formData.append("tratamento[descricao]", "Tratamento para melasma e acne");
  formData.append("tratamento[conduta]", "Peeling químico e limpeza de pele");
  formData.append("tratamento[valor]", "R$ 500,00");
  formData.append("tratamento[data]", "2024-01-15");
  formData.append(
    "tratamento[assinatura]",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  );
  formData.append("tratamento[termosAceitos][termo1]", "true");
  formData.append("tratamento[termosAceitos][termo2]", "true");

  formData.append("tratamentoSugerido[tratamento]", "Peeling + Limpeza");
  formData.append("tratamentoSugerido[numeroSessao]", "6");
  formData.append("tratamentoSugerido[valorSessao]", "150");
  formData.append("tratamentoSugerido[valorTotal]", "900");
  formData.append("tratamentoSugerido[preAgendamento]", "2024-01-20");
  formData.append("tratamentoSugerido[horario]", "14:00");

  formData.append(
    "contratoAssinaturas[0][contratanteAssinatura]",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  );
  formData.append(
    "contratoAssinaturas[0][contratadaAssinatura]",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  );
  formData.append("contratoAssinaturas[0][data]", "2024-01-15");

  formData.append(
    "contractSignatures[clientSignature]",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  );
  formData.append(
    "contractSignatures[providerSignature]",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  );

  formData.append("observacoes", "Paciente com pele sensível");
  formData.append("historicoFamiliar", "Mãe com melasma");
  formData.append("medicamentosEmUso[]", "Anticoncepcional");
  formData.append("medicamentosEmUso[]", "Vitamina D");
  formData.append("cirurgiasAnteriores[]", "Apendicectomia");
  formData.append("examesRecentes[]", "Hemograma normal");

  formData.append("telefoneResidencial", "(11) 3333-3333");
  formData.append("telefoneComercial", "(11) 4444-4444");
  formData.append("telefoneCelular", "(11) 99999-9999");

  formData.append("cep", "01234-567");
  formData.append("cidade", "São Paulo");
  formData.append("estado", "SP");
  formData.append("bairro", "Centro");
  formData.append("numero", "123");
  formData.append("complemento", "Apto 45");

  formData.append("responsavelNome", "Maria Silva");
  formData.append("responsavelCpf", "987.654.321-00");
  formData.append("responsavelContato", "(11) 88888-8888");

  formData.append("contatoEmergencia", "Maria Silva");
  formData.append("telefoneEmergencia", "(11) 88888-8888");
  formData.append("parentescoEmergencia", "Esposa");

  formData.append("planoDeSaude", "Unimed");
  formData.append("numeroPlano", "123456789");

  formData.append("empresa", "Tech Corp");
  formData.append("cargo", "Engenheiro de Software");
  formData.append("tempoTrabalho", "5 anos");

  formData.append("usoProtetorSolar", "Sim");
  formData.append("frequenciaProtetor", "Diariamente");
  formData.append("tipoProtetor", "FPS 50");
  formData.append("exposicaoSolar", "Moderada");

  formData.append("tipoPele", "Mista");
  formData.append("sensibilidadePele", "Sensível");
  formData.append("reacoesAnteriores[]", "Vermelhidão com ácidos");

  formData.append("expectativasTratamento", "Melhorar manchas e acne");
  formData.append("disponibilidadeHorarios[]", "Manhã");
  formData.append("disponibilidadeHorarios[]", "Tarde");
  formData.append("preferenciaTratamento", "Não invasivo");

  formData.append("formaPagamento", "Cartão de crédito");
  formData.append("parcelamento", "6x");

  formData.append("acompanhante", "Esposa");
  formData.append("observacoesEspeciais", "Alérgico a parabenos");

  try {
    const response = await axios.post(`${BASE_URL}/pacientes`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
    });

    console.log("✅ Paciente criado com sucesso!");
    console.log("ID do paciente:", response.data._id);
    return response.data._id;
  } catch (error) {
    console.error("❌ Erro ao criar paciente:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    console.error("Headers enviados:", {
      Authorization: `Bearer ${token.substring(0, 20)}...`,
      "Content-Type": formData.getHeaders()["content-type"],
    });
    throw error;
  }
}

async function getPacienteCompleto(token, pacienteId) {
  try {
    const response = await axios.get(`${BASE_URL}/pacientes/${pacienteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const paciente = response.data;

    console.log("\n=== VERIFICAÇÃO COMPLETA DOS CAMPOS ===");

    console.log("\n📋 DADOS BÁSICOS:");
    console.log("Nome:", paciente.nome);
    console.log("Idade:", paciente.idade);
    console.log("Profissão:", paciente.profissao);
    console.log("CPF:", paciente.cpf);
    console.log("Contato:", paciente.contato);
    console.log("Email:", paciente.email);

    console.log("\n🏥 PRIMEIRA CONSULTA:");
    console.log("Queixa:", paciente.queixa);
    console.log("Soube do trabalho:", paciente.soubeDoTrabalho);

    console.log("\n📝 HISTÓRICO DA QUEIXA:");
    console.log("Início da queixa:", paciente.inicioQueixa);
    console.log("Intensificação:", paciente.intensificacaoQueixa);
    console.log("Tratamentos anteriores:", paciente.tratamentosAnteriores);
    console.log("Uso de produtos:", paciente.usoProdutos);

    console.log("\n🏥 HISTÓRICO DE PATOLOGIAS:");
    console.log("Patologias:", paciente.patologias);

    console.log("\n👤 CONHECENDO MAIS SOBRE VOCÊ:");
    console.log("Funcionamento intestinal:", paciente.funcionamentoIntestinal);
    console.log("Gestante:", paciente.gestante);
    console.log("Contraceptivo:", paciente.contraceptivo);
    console.log("Ciclo menstrual:", paciente.cicloMenstrual);
    console.log("Última gestação:", paciente.ultimaGestacao);
    console.log("Qualidade do sono:", paciente.qualidadeSono);
    console.log("Ansiedade:", paciente.ansiedade);
    console.log("Nervosismo:", paciente.nervosismo);
    console.log("Exercício:", paciente.exercicio);

    console.log("\n🍽️ HÁBITOS E ALIMENTAÇÃO:");
    console.log("Tabagista:", paciente.tabagista);
    console.log("Álcool:", paciente.alcool);
    console.log("COVID:", paciente.covid);
    console.log("Sequelas:", paciente.sequelas);
    console.log("Alergias:", paciente.alergias);
    console.log("Suplementação:", paciente.suplementacao);
    console.log("Descrição suplementação:", paciente.suplementacaoDescricao);
    console.log("Refeições:", paciente.refeicoes);
    console.log("Carne:", paciente.carne);
    console.log("Lanches:", paciente.lanches);
    console.log("Refrigerante:", paciente.refrigerante);
    console.log("Frutas:", paciente.frutas);
    console.log("Leite:", paciente.leite);
    console.log("Madrugada:", paciente.madrugada);
    console.log("Último horário:", paciente.ultimoHorario);
    console.log("Horário que dorme:", paciente.horarioDorme);
    console.log("Intolerância:", paciente.intolerancia);

    console.log("\n👩‍⚕️ CONDIÇÕES DA PELE:");
    console.log("Melasma:", paciente.melasma);
    console.log("Manchas:", paciente.manchas);
    console.log("Linhas:", paciente.linhas);
    console.log("Acne:", paciente.acne);
    console.log("Grau:", paciente.grau);
    console.log("Região acne:", paciente.regiaoAcne);
    console.log("Cicatriz:", paciente.cicatriz);
    console.log("Tipo cicatriz:", paciente.tipoCicatriz);
    console.log("Olheiras:", paciente.olheiras);
    console.log("Tipo olheiras:", paciente.tipoOlheiras);

    console.log("\n💊 TRATAMENTO:");
    if (paciente.tratamento) {
      console.log("Diagnóstico:", paciente.tratamento.diagnostico);
      console.log("Descrição:", paciente.tratamento.descricao);
      console.log("Conduta:", paciente.tratamento.conduta);
      console.log("Valor:", paciente.tratamento.valor);
      console.log("Data:", paciente.tratamento.data);
      console.log(
        "Assinatura:",
        paciente.tratamento.assinatura ? "✅ Presente" : "❌ Ausente"
      );
      console.log("Termo 1:", paciente.tratamento.termosAceitos?.termo1);
      console.log("Termo 2:", paciente.tratamento.termosAceitos?.termo2);
    }

    console.log("\n📋 TRATAMENTO SUGERIDO:");
    if (paciente.tratamentoSugerido) {
      console.log("Tratamento:", paciente.tratamentoSugerido.tratamento);
      console.log(
        "Número de sessão:",
        paciente.tratamentoSugerido.numeroSessao
      );
      console.log("Valor da sessão:", paciente.tratamentoSugerido.valorSessao);
      console.log("Valor total:", paciente.tratamentoSugerido.valorTotal);
      console.log(
        "Pré-agendamento:",
        paciente.tratamentoSugerido.preAgendamento
      );
      console.log("Horário:", paciente.tratamentoSugerido.horario);
    }

    console.log("\n📄 CONTRATO E ASSINATURAS:");
    if (
      paciente.contratoAssinaturas &&
      paciente.contratoAssinaturas.length > 0
    ) {
      console.log(
        "Número de assinaturas:",
        paciente.contratoAssinaturas.length
      );
      paciente.contratoAssinaturas.forEach((assinatura, index) => {
        console.log(`Assinatura ${index + 1}:`);
        console.log(
          "  Contratante:",
          assinatura.contratanteAssinatura ? "✅ Presente" : "❌ Ausente"
        );
        console.log(
          "  Contratada:",
          assinatura.contratadaAssinatura ? "✅ Presente" : "❌ Ausente"
        );
        console.log("  Data:", assinatura.data);
      });
    }

    console.log("\n📋 CONTRATO DE SERVIÇOS ESTÉTICOS:");
    if (paciente.contractSignatures) {
      console.log(
        "Assinatura do cliente:",
        paciente.contractSignatures.clientSignature
          ? "✅ Presente"
          : "❌ Ausente"
      );
      console.log(
        "Assinatura do provedor:",
        paciente.contractSignatures.providerSignature
          ? "✅ Presente"
          : "❌ Ausente"
      );
    }

    console.log("\n📝 CAMPOS ADICIONAIS:");
    console.log("Observações:", paciente.observacoes);
    console.log("Histórico familiar:", paciente.historicoFamiliar);
    console.log("Medicamentos em uso:", paciente.medicamentosEmUso);
    console.log("Cirurgias anteriores:", paciente.cirurgiasAnteriores);
    console.log("Exames recentes:", paciente.examesRecentes);

    console.log("\n📞 CAMPOS DE CONTATO:");
    console.log("Telefone residencial:", paciente.telefoneResidencial);
    console.log("Telefone comercial:", paciente.telefoneComercial);
    console.log("Telefone celular:", paciente.telefoneCelular);

    console.log("\n🏠 CAMPOS DE ENDEREÇO:");
    console.log("CEP:", paciente.cep);
    console.log("Cidade:", paciente.cidade);
    console.log("Estado:", paciente.estado);
    console.log("Bairro:", paciente.bairro);
    console.log("Número:", paciente.numero);
    console.log("Complemento:", paciente.complemento);

    console.log("\n👨‍👩‍👧‍👦 CAMPOS DE RESPONSÁVEL:");
    console.log("Nome do responsável:", paciente.responsavelNome);
    console.log("CPF do responsável:", paciente.responsavelCpf);
    console.log("Contato do responsável:", paciente.responsavelContato);

    console.log("\n🚨 CAMPOS DE EMERGÊNCIA:");
    console.log("Contato de emergência:", paciente.contatoEmergencia);
    console.log("Telefone de emergência:", paciente.telefoneEmergencia);
    console.log("Parentesco de emergência:", paciente.parentescoEmergencia);

    console.log("\n🏥 CAMPOS DE PLANO DE SAÚDE:");
    console.log("Plano de saúde:", paciente.planoDeSaude);
    console.log("Número do plano:", paciente.numeroPlano);

    console.log("\n💼 CAMPOS DE TRABALHO:");
    console.log("Empresa:", paciente.empresa);
    console.log("Cargo:", paciente.cargo);
    console.log("Tempo de trabalho:", paciente.tempoTrabalho);

    console.log("\n🌞 CAMPOS DE HÁBITOS ESPECÍFICOS:");
    console.log("Uso de protetor solar:", paciente.usoProtetorSolar);
    console.log("Frequência do protetor:", paciente.frequenciaProtetor);
    console.log("Tipo de protetor:", paciente.tipoProtetor);
    console.log("Exposição solar:", paciente.exposicaoSolar);

    console.log("\n👩‍⚕️ CAMPOS DE PELE ESPECÍFICOS:");
    console.log("Tipo de pele:", paciente.tipoPele);
    console.log("Sensibilidade da pele:", paciente.sensibilidadePele);
    console.log("Reações anteriores:", paciente.reacoesAnteriores);

    console.log("\n🎯 CAMPOS DE TRATAMENTO ESPECÍFICOS:");
    console.log("Expectativas do tratamento:", paciente.expectativasTratamento);
    console.log(
      "Disponibilidade de horários:",
      paciente.disponibilidadeHorarios
    );
    console.log("Preferência de tratamento:", paciente.preferenciaTratamento);

    console.log("\n💳 CAMPOS DE PAGAMENTO:");
    console.log("Forma de pagamento:", paciente.formaPagamento);
    console.log("Parcelamento:", paciente.parcelamento);

    console.log("\n👥 CAMPOS DE ACOMPANHAMENTO:");
    console.log("Acompanhante:", paciente.acompanhante);
    console.log("Observações especiais:", paciente.observacoesEspeciais);

    console.log("\n✅ Verificação completa finalizada!");

    return paciente;
  } catch (error) {
    console.error(
      "❌ Erro ao buscar paciente:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function testAnamneseCompleta() {
  try {
    console.log("🚀 Iniciando teste completo de anamnese...\n");

    console.log("1️⃣ Fazendo login...");
    const token = await login();
    console.log("✅ Login realizado com sucesso!\n");

    console.log("2️⃣ Criando paciente com todos os campos...");
    const pacienteId = await createPacienteCompleto(token);
    console.log("✅ Paciente criado com sucesso!\n");

    console.log("3️⃣ Buscando paciente e verificando campos...");
    await getPacienteCompleto(token, pacienteId);

    console.log("\n🎉 Teste completo finalizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
    process.exit(1);
  }
}

testAnamneseCompleta();
