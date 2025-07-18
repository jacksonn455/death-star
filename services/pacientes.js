const Paciente = require("../models/pacientes");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("./cloudinaryService");
const { buildPacienteFilters } = require("../utils/filterUtils");

async function getPacientesService(query) {
  try {
    const filters = buildPacienteFilters(query);
    const pacientes = await Paciente.find(filters).sort({ nome: 1 });
    return pacientes || [];
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    throw new Error("Erro ao buscar pacientes.");
  }
}

async function getPacienteByIdService(id) {
  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      throw new Error("Paciente não encontrado.");
    }
    return paciente;
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    throw new Error("Erro ao buscar paciente.");
  }
}

async function createPacienteService(pacienteData, imageFile) {
  try {
    if (!pacienteData || Object.keys(pacienteData).length === 0) {
      throw new Error("Dados de paciente inválidos.");
    }

    if (imageFile) {
      pacienteData.image = await uploadImageToCloudinary(
        imageFile,
        "pacientes"
      );
    }

    const newPaciente = await new Paciente(pacienteData).save();
    return newPaciente;
  } catch (error) {
    console.error("Erro ao criar paciente:", error);
    throw new Error("Erro ao criar paciente.");
  }
}

async function updatePacienteService(id, updatedData) {
  try {
    const existingPaciente = await Paciente.findById(id);
    if (!existingPaciente) {
      throw new Error("Paciente não encontrado.");
    }

    if (updatedData.image && typeof updatedData.image !== "string") {
      updatedData.image = await uploadImageToCloudinary(
        updatedData.image,
        "pacientes"
      );
    } else {
      updatedData.image = existingPaciente.image;
    }

    return await Paciente.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    throw new Error("Erro ao atualizar paciente.");
  }
}

async function deletePacienteService(id) {
  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      throw new Error("Paciente não encontrado.");
    }

    if (paciente.image) {
      try {
        await deleteImageFromCloudinary(paciente.image);
      } catch (err) {
        console.warn('⚠️ Falha ao deletar a imagem do Cloudinary:', err.message);
        // Continua mesmo se falhar
      }
    }

    const deletedPaciente = await Paciente.findByIdAndDelete(id);
    return deletedPaciente;
  } catch (error) {
    console.error("Erro ao excluir paciente:", error);
    throw new Error("Erro ao excluir paciente.");
  }
}

async function createAnamneseService(pacienteId, anamneseData) {
  try {
    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) {
      throw new Error("Paciente não encontrado.");
    }

    const updatedPaciente = await Paciente.findByIdAndUpdate(
      pacienteId,
      anamneseData,
      { new: true }
    );

    return updatedPaciente;
  } catch (error) {
    console.error("Erro ao criar anamnese:", error);
    throw new Error("Erro ao criar anamnese.");
  }
}

async function updateAnamneseService(pacienteId, anamneseData) {
  try {
    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) {
      throw new Error("Paciente não encontrado.");
    }

    const updatedPaciente = await Paciente.findByIdAndUpdate(
      pacienteId,
      anamneseData,
      { new: true }
    );

    return updatedPaciente;
  } catch (error) {
    console.error("Erro ao atualizar anamnese:", error);
    throw new Error("Erro ao atualizar anamnese.");
  }
}

async function getAnamneseService(pacienteId) {
  try {
    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) {
      throw new Error("Paciente não encontrado.");
    }

    const anamneseData = {
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

      patologias: paciente.patologias,

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
      manchas: paciente.manchas,
      linhas: paciente.linhas,
      acne: paciente.acne,
      grau: paciente.grau,
      regiaoAcne: paciente.regiaoAcne,
      cicatriz: paciente.cicatriz,
      tipoCicatriz: paciente.tipoCicatriz,
      olheiras: paciente.olheiras,
      tipoOlheiras: paciente.tipoOlheiras,

      tratamento: paciente.tratamento,

      tratamentoSugerido: paciente.tratamentoSugerido,

      contratoAssinaturas: paciente.contratoAssinaturas,

      contractSignatures: paciente.contractSignatures,

      observacoes: paciente.observacoes,
      historicoFamiliar: paciente.historicoFamiliar,
      medicamentosEmUso: paciente.medicamentosEmUso,
      cirurgiasAnteriores: paciente.cirurgiasAnteriores,
      examesRecentes: paciente.examesRecentes,

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
      reacoesAnteriores: paciente.reacoesAnteriores,

      expectativasTratamento: paciente.expectativasTratamento,
      disponibilidadeHorarios: paciente.disponibilidadeHorarios,
      preferenciaTratamento: paciente.preferenciaTratamento,

      formaPagamento: paciente.formaPagamento,
      parcelamento: paciente.parcelamento,

      acompanhante: paciente.acompanhante,
      observacoesEspeciais: paciente.observacoesEspeciais,
    };

    return anamneseData;
  } catch (error) {
    console.error("Erro ao buscar anamnese:", error);
    throw new Error("Erro ao buscar anamnese.");
  }
}

module.exports = {
  getPacientesService,
  getPacienteByIdService,
  createPacienteService,
  updatePacienteService,
  deletePacienteService,
  createAnamneseService,
  updateAnamneseService,
  getAnamneseService,
};
