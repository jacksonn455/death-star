const {
  getPacientesService,
  getPacienteByIdService,
  createPacienteService,
  updatePacienteService,
  deletePacienteService,
  createAnamneseService,
  updateAnamneseService,
  getAnamneseService,
} = require("../services/pacientes");
const { uploadImageToCloudinary } = require("../services/cloudinaryService");
const {
  validateId,
  validateRequiredFields,
  validateFileType,
} = require("../utils/validationUtils");

async function getPacientes(req, res) {
  const { nome, aniversariantesSemana } = req.query || {};
  const pacientes = await getPacientesService({ nome, aniversariantesSemana });
  res.status(200).json(pacientes);
}

async function getPacienteById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID do paciente é obrigatório" });
    }

    validateId(String(id));
    const paciente = await getPacienteByIdService(id);

    if (!paciente) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }

    const pacienteCompleto = {
      _id: paciente._id,
      nome: paciente.nome,
      idade: paciente.idade,
      profissao: paciente.profissao,
      dataNascimento: paciente.dataNascimento,
      cpf: paciente.cpf,
      rg: paciente.rg,
      contato: paciente.contato,
      email: paciente.email,
      endereco: paciente.endereco,
      escolaridade: paciente.escolaridade,
      estadoCivil: paciente.estadoCivil,
      image: paciente.image,

      queixa: paciente.queixa,
      soubeDoTrabalho: paciente.soubeDoTrabalho,

      inicioQueixa: paciente.inicioQueixa,
      intensificacaoQueixa: paciente.intensificacaoQueixa,
      tratamentosAnteriores: paciente.tratamentosAnteriores,
      usoProdutos: paciente.usoProdutos,

      patologias: paciente.patologias || [],

      funcionamentoIntestinal: paciente.funcionamentoIntestinal,
      gestante: paciente.gestante,
      contraceptivo: paciente.contraceptivo,
      cicloMenstrual: paciente.cicloMenstrual,
      ultimaGestacao: paciente.ultimaGestacao,
      qualidadeSono: paciente.qualidadeSono,
      ansiedade: paciente.ansiedade,
      nervosismo: paciente.nervosismo,
      exercicio: paciente.exercicio,

      tabagista: paciente.tabagista,
      alcool: paciente.alcool,
      covid: paciente.covid,
      sequelas: paciente.sequelas,
      alergias: paciente.alergias,
      suplementacao: paciente.suplementacao,
      suplementacaoDescricao: paciente.suplementacaoDescricao,
      refeicoes: paciente.refeicoes,
      carne: paciente.carne,
      lanches: paciente.lanches,
      refrigerante: paciente.refrigerante,
      frutas: paciente.frutas,
      leite: paciente.leite,
      madrugada: paciente.madrugada,
      ultimoHorario: paciente.ultimoHorario,
      horarioDorme: paciente.horarioDorme,
      intolerancia: paciente.intolerancia,

      melasma: paciente.melasma,
      manchas: paciente.manchas || [],
      linhas: paciente.linhas || [],
      acne: paciente.acne,
      grau: paciente.grau,
      regiaoAcne: paciente.regiaoAcne || [],
      cicatriz: paciente.cicatriz,
      tipoCicatriz: paciente.tipoCicatriz || [],
      olheiras: paciente.olheiras,
      tipoOlheiras: paciente.tipoOlheiras || [],

      tratamento: paciente.tratamento || {},

      tratamentoSugerido: paciente.tratamentoSugerido || {},

      contratoAssinaturas: paciente.contratoAssinaturas || [],

      contractSignatures: paciente.contractSignatures || {},

      observacoes: paciente.observacoes,
      historicoFamiliar: paciente.historicoFamiliar,
      medicamentosEmUso: paciente.medicamentosEmUso || [],
      cirurgiasAnteriores: paciente.cirurgiasAnteriores || [],
      examesRecentes: paciente.examesRecentes || [],

      telefoneResidencial: paciente.telefoneResidencial,
      telefoneComercial: paciente.telefoneComercial,
      telefoneCelular: paciente.telefoneCelular,

      cep: paciente.cep,
      cidade: paciente.cidade,
      estado: paciente.estado,
      bairro: paciente.bairro,
      numero: paciente.numero,
      complemento: paciente.complemento,

      responsavelNome: paciente.responsavelNome,
      responsavelCpf: paciente.responsavelCpf,
      responsavelContato: paciente.responsavelContato,

      contatoEmergencia: paciente.contatoEmergencia,
      telefoneEmergencia: paciente.telefoneEmergencia,
      parentescoEmergencia: paciente.parentescoEmergencia,

      planoDeSaude: paciente.planoDeSaude,
      numeroPlano: paciente.numeroPlano,

      empresa: paciente.empresa,
      cargo: paciente.cargo,
      tempoTrabalho: paciente.tempoTrabalho,

      usoProtetorSolar: paciente.usoProtetorSolar,
      frequenciaProtetor: paciente.frequenciaProtetor,
      tipoProtetor: paciente.tipoProtetor,
      exposicaoSolar: paciente.exposicaoSolar,

      tipoPele: paciente.tipoPele,
      sensibilidadePele: paciente.sensibilidadePele,
      reacoesAnteriores: paciente.reacoesAnteriores || [],

      expectativasTratamento: paciente.expectativasTratamento,
      disponibilidadeHorarios: paciente.disponibilidadeHorarios || [],
      preferenciaTratamento: paciente.preferenciaTratamento,

      formaPagamento: paciente.formaPagamento,
      parcelamento: paciente.parcelamento,

      acompanhante: paciente.acompanhante,
      observacoesEspeciais: paciente.observacoesEspeciais,

      createdAt: paciente.createdAt,
      updatedAt: paciente.updatedAt,
    };

    res.status(200).json(pacienteCompleto);
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    res.status(500).json({ error: error.message });
  }
}

async function createPaciente(req, res) {
  const requiredFields = ["nome", "idade", "dataNascimento"];
  validateRequiredFields(req.body, requiredFields);

  let image = null;
  if (req.file) {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    validateFileType(req.file, allowedFileTypes);
    image = await uploadImageToCloudinary(req.file, "pacientes");
  }

  const pacienteData = { ...req.body, image };

  console.log("🔍 Campos recebidos no createPaciente:");
  console.log("diagnostico:", req.body.diagnostico);
  console.log("descricao:", req.body.descricao);
  console.log("conduta:", req.body.conduta);
  console.log("valor:", req.body.valor);
  console.log("data:", req.body.data);
  console.log("assinatura:", req.body.assinatura ? "Presente" : "Ausente");
  console.log("termo1:", req.body.termo1);
  console.log("termo2:", req.body.termo2);
  console.log(
    "clientSignature:",
    req.body.clientSignature ? "Presente" : "Ausente"
  );
  console.log(
    "providerSignature:",
    req.body.providerSignature ? "Presente" : "Ausente"
  );
  console.log("patologias:", req.body.patologias);
  console.log("manchas:", req.body.manchas);
  console.log("linhas:", req.body.linhas);
  console.log("regiaoAcne:", req.body.regiaoAcne);
  console.log("tipoCicatriz:", req.body.tipoCicatriz);
  console.log("tipoOlheiras:", req.body.tipoOlheiras);

  if (
    req.body.diagnostico ||
    req.body.descricao ||
    req.body.conduta ||
    req.body.valor ||
    req.body.data ||
    req.body.assinatura ||
    req.body.termo1 !== undefined ||
    req.body.termo2 !== undefined ||
    req.body["tratamento[diagnostico]"]
  ) {
    pacienteData.tratamento = {
      diagnostico:
        req.body.diagnostico || req.body["tratamento[diagnostico]"] || "",
      descricao: req.body.descricao || req.body["tratamento[descricao]"] || "",
      conduta: req.body.conduta || req.body["tratamento[conduta]"] || "",
      valor: req.body.valor || req.body["tratamento[valor]"] || "",
      data: req.body.data || req.body["tratamento[data]"] || "",
      assinatura:
        req.body.assinatura || req.body["tratamento[assinatura]"] || "",
      termosAceitos: {
        termo1:
          req.body.termo1 === "true" ||
          req.body.termo1 === true ||
          req.body["tratamento[termosAceitos][termo1]"] === "true" ||
          req.body["tratamento[termosAceitos][termo1]"] === true,
        termo2:
          req.body.termo2 === "true" ||
          req.body.termo2 === true ||
          req.body["tratamento[termosAceitos][termo2]"] === "true" ||
          req.body["tratamento[termosAceitos][termo2]"] === true,
      },
    };
    console.log("✅ Tratamento processado:", pacienteData.tratamento);
  }

  if (req.body.patologias && typeof req.body.patologias === "string") {
    pacienteData.patologias = req.body.patologias
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log("✅ Patologias processadas:", pacienteData.patologias);
  } else if (Array.isArray(req.body.patologias)) {
    pacienteData.patologias = req.body.patologias;
    console.log("✅ Patologias processadas (array):", pacienteData.patologias);
  }

  if (req.body.manchas && typeof req.body.manchas === "string") {
    pacienteData.manchas = req.body.manchas
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log("✅ Manchas processadas:", pacienteData.manchas);
  } else if (Array.isArray(req.body.manchas)) {
    pacienteData.manchas = req.body.manchas;
    console.log("✅ Manchas processadas (array):", pacienteData.manchas);
  }

  if (req.body.linhas && typeof req.body.linhas === "string") {
    pacienteData.linhas = req.body.linhas
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log("✅ Linhas processadas:", pacienteData.linhas);
  } else if (Array.isArray(req.body.linhas)) {
    pacienteData.linhas = req.body.linhas;
    console.log("✅ Linhas processadas (array):", pacienteData.linhas);
  }

  if (req.body.regiaoAcne && typeof req.body.regiaoAcne === "string") {
    pacienteData.regiaoAcne = req.body.regiaoAcne
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log("✅ Região acne processada:", pacienteData.regiaoAcne);
  } else if (Array.isArray(req.body.regiaoAcne)) {
    pacienteData.regiaoAcne = req.body.regiaoAcne;
    console.log("✅ Região acne processada (array):", pacienteData.regiaoAcne);
  }

  if (req.body.tipoCicatriz && typeof req.body.tipoCicatriz === "string") {
    pacienteData.tipoCicatriz = req.body.tipoCicatriz
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log("✅ Tipo cicatriz processado:", pacienteData.tipoCicatriz);
  } else if (Array.isArray(req.body.tipoCicatriz)) {
    pacienteData.tipoCicatriz = req.body.tipoCicatriz;
    console.log(
      "✅ Tipo cicatriz processado (array):",
      pacienteData.tipoCicatriz
    );
  }

  if (req.body.tipoOlheiras && typeof req.body.tipoOlheiras === "string") {
    pacienteData.tipoOlheiras = req.body.tipoOlheiras
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log("✅ Tipo olheiras processado:", pacienteData.tipoOlheiras);
  } else if (Array.isArray(req.body.tipoOlheiras)) {
    pacienteData.tipoOlheiras = req.body.tipoOlheiras;
    console.log(
      "✅ Tipo olheiras processado (array):",
      pacienteData.tipoOlheiras
    );
  }

  if (
    req.body.medicamentosEmUso &&
    typeof req.body.medicamentosEmUso === "string"
  ) {
    pacienteData.medicamentosEmUso = req.body.medicamentosEmUso
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log(
      "✅ Medicamentos em uso processados:",
      pacienteData.medicamentosEmUso
    );
  } else if (Array.isArray(req.body.medicamentosEmUso)) {
    pacienteData.medicamentosEmUso = req.body.medicamentosEmUso;
    console.log(
      "✅ Medicamentos em uso processados (array):",
      pacienteData.medicamentosEmUso
    );
  }

  if (
    req.body.cirurgiasAnteriores &&
    typeof req.body.cirurgiasAnteriores === "string"
  ) {
    pacienteData.cirurgiasAnteriores = req.body.cirurgiasAnteriores
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log(
      "✅ Cirurgias anteriores processadas:",
      pacienteData.cirurgiasAnteriores
    );
  } else if (Array.isArray(req.body.cirurgiasAnteriores)) {
    pacienteData.cirurgiasAnteriores = req.body.cirurgiasAnteriores;
    console.log(
      "✅ Cirurgias anteriores processadas (array):",
      pacienteData.cirurgiasAnteriores
    );
  }

  if (req.body.examesRecentes && typeof req.body.examesRecentes === "string") {
    pacienteData.examesRecentes = req.body.examesRecentes
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log("✅ Exames recentes processados:", pacienteData.examesRecentes);
  } else if (Array.isArray(req.body.examesRecentes)) {
    pacienteData.examesRecentes = req.body.examesRecentes;
    console.log(
      "✅ Exames recentes processados (array):",
      pacienteData.examesRecentes
    );
  }

  if (
    req.body.reacoesAnteriores &&
    typeof req.body.reacoesAnteriores === "string"
  ) {
    pacienteData.reacoesAnteriores = req.body.reacoesAnteriores
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log(
      "✅ Reações anteriores processadas:",
      pacienteData.reacoesAnteriores
    );
  } else if (Array.isArray(req.body.reacoesAnteriores)) {
    pacienteData.reacoesAnteriores = req.body.reacoesAnteriores;
    console.log(
      "✅ Reações anteriores processadas (array):",
      pacienteData.reacoesAnteriores
    );
  }

  if (
    req.body.disponibilidadeHorarios &&
    typeof req.body.disponibilidadeHorarios === "string"
  ) {
    pacienteData.disponibilidadeHorarios = req.body.disponibilidadeHorarios
      .split(/,\s*/)
      .map((item) => item.trim())
      .filter((item) => item);
    console.log(
      "✅ Disponibilidade horários processada:",
      pacienteData.disponibilidadeHorarios
    );
  } else if (Array.isArray(req.body.disponibilidadeHorarios)) {
    pacienteData.disponibilidadeHorarios = req.body.disponibilidadeHorarios;
    console.log(
      "✅ Disponibilidade horários processada (array):",
      pacienteData.disponibilidadeHorarios
    );
  }

  if (req.body.contratoAssinaturas) {
    if (Array.isArray(req.body.contratoAssinaturas)) {
      pacienteData.contratoAssinaturas = req.body.contratoAssinaturas;
    } else {
      const assinaturas = [];
      for (let i = 0; i < 12; i++) {
        const contratante =
          req.body[`contratoAssinaturas[${i}][contratanteAssinatura]`];
        const contratada =
          req.body[`contratoAssinaturas[${i}][contratadaAssinatura]`];
        const data = req.body[`contratoAssinaturas[${i}][data]`];

        if (contratante || contratada || data) {
          assinaturas.push({
            contratanteAssinatura: contratante || "",
            contratadaAssinatura: contratada || "",
            data: data ? new Date(data) : null,
          });
        }
      }
      if (assinaturas.length > 0) {
        pacienteData.contratoAssinaturas = assinaturas;
      }
    }
  }

  if (
    req.body.clientSignature ||
    req.body.providerSignature ||
    req.body["contractSignatures[clientSignature]"] ||
    req.body["contractSignatures[providerSignature]"]
  ) {
    pacienteData.contractSignatures = {
      clientSignature:
        req.body.clientSignature ||
        req.body["contractSignatures[clientSignature]"] ||
        "",
      providerSignature:
        req.body.providerSignature ||
        req.body["contractSignatures[providerSignature]"] ||
        "",
    };
    console.log("✅ ContractSignatures processado:", {
      clientSignature: pacienteData.contractSignatures.clientSignature
        ? "Presente"
        : "Ausente",
      providerSignature: pacienteData.contractSignatures.providerSignature
        ? "Presente"
        : "Ausente",
    });
  }

  const camposObrigatorios = [
    "profissao",
    "cpf",
    "rg",
    "contato",
    "endereco",
    "escolaridade",
    "estadoCivil",
    "queixa",
    "soubeDoTrabalho",
    "inicioQueixa",
    "intensificacaoQueixa",
    "tratamentosAnteriores",
    "usoProdutos",
    "tabagista",
    "alcool",
    "covid",
    "sequelas",
    "alergias",
    "suplementacao",
    "suplementacaoDescricao",
    "refeicoes",
    "carne",
    "lanches",
    "refrigerante",
    "frutas",
    "leite",
    "madrugada",
    "ultimoHorario",
    "horarioDorme",
    "intolerancia",
    "melasma",
    "acne",
    "grau",
    "cicatriz",
    "olheiras",
  ];

  camposObrigatorios.forEach((campo) => {
    if (pacienteData[campo] === undefined || pacienteData[campo] === null) {
      pacienteData[campo] = "";
    }
  });

  delete pacienteData.diagnostico;
  delete pacienteData.descricao;
  delete pacienteData.conduta;
  delete pacienteData.valor;
  delete pacienteData.data;
  delete pacienteData.assinatura;
  delete pacienteData.termo1;
  delete pacienteData.termo2;

  const newPaciente = await createPacienteService(pacienteData);
  res.status(201).json(newPaciente);
}

async function updatePaciente(req, res) {
  const { id } = req.params;
  validateId(String(id));

  const updatedData = { ...req.body };

  if (
    req.body.diagnostico ||
    req.body.descricao ||
    req.body.conduta ||
    req.body.valor ||
    req.body.data ||
    req.body.assinatura ||
    req.body.termo1 !== undefined ||
    req.body.termo2 !== undefined
  ) {
    updatedData.tratamento = {
      diagnostico: req.body.diagnostico || "",
      descricao: req.body.descricao || "",
      conduta: req.body.conduta || "",
      valor: req.body.valor || "",
      data: req.body.data || "",
      assinatura: req.body.assinatura || "",
      termosAceitos: {
        termo1: req.body.termo1 === "true" || req.body.termo1 === true,
        termo2: req.body.termo2 === "true" || req.body.termo2 === true,
      },
    };
  }

  if (req.body.patologias && typeof req.body.patologias === "string") {
    updatedData.patologias = req.body.patologias
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
  }

  if (req.body.manchas && typeof req.body.manchas === "string") {
    updatedData.manchas = req.body.manchas
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
  }

  if (req.body.linhas && typeof req.body.linhas === "string") {
    updatedData.linhas = req.body.linhas
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
  }

  if (req.body.regiaoAcne && typeof req.body.regiaoAcne === "string") {
    updatedData.regiaoAcne = req.body.regiaoAcne
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
  }

  if (req.body.tipoCicatriz && typeof req.body.tipoCicatriz === "string") {
    updatedData.tipoCicatriz = req.body.tipoCicatriz
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
  }

  if (req.body.tipoOlheiras && typeof req.body.tipoOlheiras === "string") {
    updatedData.tipoOlheiras = req.body.tipoOlheiras
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
  }

  if (req.body.contratoAssinaturas) {
    if (Array.isArray(req.body.contratoAssinaturas)) {
      updatedData.contratoAssinaturas = req.body.contratoAssinaturas;
    } else {
      const assinaturas = [];
      for (let i = 0; i < 12; i++) {
        const contratante =
          req.body[`contratoAssinaturas[${i}][contratanteAssinatura]`];
        const contratada =
          req.body[`contratoAssinaturas[${i}][contratadaAssinatura]`];
        const data = req.body[`contratoAssinaturas[${i}][data]`];

        if (contratante || contratada || data) {
          assinaturas.push({
            contratanteAssinatura: contratante || "",
            contratadaAssinatura: contratada || "",
            data: data ? new Date(data) : null,
          });
        }
      }
      if (assinaturas.length > 0) {
        updatedData.contratoAssinaturas = assinaturas;
      }
    }
  }

  if (req.body.clientSignature || req.body.providerSignature) {
    updatedData.contractSignatures = {
      clientSignature: req.body.clientSignature || "",
      providerSignature: req.body.providerSignature || "",
    };
  }

  const camposObrigatorios = [
    "profissao",
    "cpf",
    "rg",
    "contato",
    "endereco",
    "escolaridade",
    "estadoCivil",
    "queixa",
    "soubeDoTrabalho",
    "inicioQueixa",
    "intensificacaoQueixa",
    "tratamentosAnteriores",
    "usoProdutos",
    "tabagista",
    "alcool",
    "covid",
    "sequelas",
    "alergias",
    "suplementacao",
    "suplementacaoDescricao",
    "refeicoes",
    "carne",
    "lanches",
    "refrigerante",
    "frutas",
    "leite",
    "madrugada",
    "ultimoHorario",
    "horarioDorme",
    "intolerancia",
    "melasma",
    "acne",
    "grau",
    "cicatriz",
    "olheiras",
  ];

  camposObrigatorios.forEach((campo) => {
    if (updatedData[campo] === undefined || updatedData[campo] === null) {
      updatedData[campo] = "";
    }
  });

  delete updatedData.diagnostico;
  delete updatedData.descricao;
  delete updatedData.conduta;
  delete updatedData.valor;
  delete updatedData.data;
  delete updatedData.assinatura;
  delete updatedData.termo1;
  delete updatedData.termo2;

  const updatedPaciente = await updatePacienteService(id, updatedData);
  if (!updatedPaciente) {
    return res.status(404).send("Paciente não encontrado.");
  }
  res.status(200).json(updatedPaciente);
}

async function deletePaciente(req, res) {
  const { id } = req.params;
  validateId(String(id));
  const paciente = await deletePacienteService(id);
  if (!paciente) {
    return res.status(404).send("Paciente não encontrado.");
  }
  res.status(200).send("Paciente excluído com sucesso.");
}

async function getAnamnese(req, res) {
  try {
    const { id } = req.params;
    validateId(String(id));

    const anamnese = await getAnamneseService(id);
    res.status(200).json(anamnese);
  } catch (error) {
    console.error("Erro ao buscar anamnese:", error);
    res.status(500).json({ error: error.message });
  }
}

async function createAnamnese(req, res) {
  try {
    const { id } = req.params;
    validateId(String(id));

    const anamneseData = req.body;
    const paciente = await createAnamneseService(id, anamneseData);

    res.status(201).json(paciente);
  } catch (error) {
    console.error("Erro ao criar anamnese:", error);
    res.status(500).json({ error: error.message });
  }
}

async function updateAnamnese(req, res) {
  try {
    const { id } = req.params;
    validateId(String(id));

    const anamneseData = req.body;
    const paciente = await updateAnamneseService(id, anamneseData);

    res.status(200).json(paciente);
  } catch (error) {
    console.error("Erro ao atualizar anamnese:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente,
  getAnamnese,
  createAnamnese,
  updateAnamnese,
};
