const mongoose = require("mongoose");

const PacienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number, required: true },
  profissao: { type: String },
  dataNascimento: { type: Date, required: true },
  cpf: { type: String },
  rg: { type: String },
  contato: { type: String },
  email: { type: String },
  endereco: { type: String },
  escolaridade: { type: String },
  estadoCivil: { type: String },
  image: { type: String, required: false },

  queixa: { type: String },
  soubeDoTrabalho: { type: String },

  inicioQueixa: { type: String },
  intensificacaoQueixa: { type: String },
  tratamentosAnteriores: { type: String },
  usoProdutos: { type: String },

  patologias: [{ type: String }],

  funcionamentoIntestinal: { type: String },
  gestante: { type: String },
  contraceptivo: { type: String },
  cicloMenstrual: { type: String },
  ultimaGestacao: { type: String },
  qualidadeSono: { type: String },
  ansiedade: { type: String },
  nervosismo: { type: String },
  exercicio: { type: String },

  tabagista: { type: String },
  alcool: { type: String },
  covid: { type: String },
  sequelas: { type: String },
  alergias: { type: String },
  suplementacao: { type: String },
  suplementacaoDescricao: { type: String },
  refeicoes: { type: String },
  carne: { type: String },
  lanches: { type: String },
  refrigerante: { type: String },
  frutas: { type: String },
  leite: { type: String },
  madrugada: { type: String },
  ultimoHorario: { type: String },
  horarioDorme: { type: String },
  intolerancia: { type: String },

  melasma: { type: String },
  manchas: [{ type: String }],
  linhas: [{ type: String }],
  acne: { type: String },
  grau: { type: String },
  regiaoAcne: [{ type: String }],
  cicatriz: { type: String },
  tipoCicatriz: [{ type: String }],
  olheiras: { type: String },
  tipoOlheiras: [{ type: String }],

  tratamento: {
    diagnostico: { type: String },
    descricao: { type: String },
    conduta: { type: String },
    valor: { type: String },
    data: { type: String },
    assinatura: { type: String },
    termosAceitos: {
      termo1: { type: Boolean, default: false },
      termo2: { type: Boolean, default: false },
    },
  },

  tratamentoSugerido: {
    tratamento: { type: String },
    numeroSessao: { type: Number },
    valorSessao: { type: Number },
    valorTotal: { type: Number },
    preAgendamento: { type: String },
    horario: { type: String },
  },

  contratoAssinaturas: [
    {
      contratanteAssinatura: String,
      contratadaAssinatura: String,
      data: Date,
    },
  ],

  contractSignatures: {
    clientSignature: { type: String },
    providerSignature: { type: String },
  },

  observacoes: { type: String },
  historicoFamiliar: { type: String },
  medicamentosEmUso: [{ type: String }],
  cirurgiasAnteriores: [{ type: String }],
  examesRecentes: [{ type: String }],

  telefoneResidencial: { type: String },
  telefoneComercial: { type: String },
  telefoneCelular: { type: String },

  cep: { type: String },
  cidade: { type: String },
  estado: { type: String },
  bairro: { type: String },
  numero: { type: String },
  complemento: { type: String },

  responsavelNome: { type: String },
  responsavelCpf: { type: String },
  responsavelContato: { type: String },

  contatoEmergencia: { type: String },
  telefoneEmergencia: { type: String },
  parentescoEmergencia: { type: String },

  planoDeSaude: { type: String },
  numeroPlano: { type: String },

  empresa: { type: String },
  cargo: { type: String },
  tempoTrabalho: { type: String },

  usoProtetorSolar: { type: String },
  frequenciaProtetor: { type: String },
  tipoProtetor: { type: String },
  exposicaoSolar: { type: String },

  tipoPele: { type: String },
  sensibilidadePele: { type: String },
  reacoesAnteriores: [{ type: String }],

  expectativasTratamento: { type: String },
  disponibilidadeHorarios: [{ type: String }],
  preferenciaTratamento: { type: String },

  formaPagamento: { type: String },
  parcelamento: { type: String },

  acompanhante: { type: String },
  observacoesEspeciais: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

PacienteSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

PacienteSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Paciente = mongoose.model("Paciente", PacienteSchema);

module.exports = Paciente;
