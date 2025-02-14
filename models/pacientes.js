const mongoose = require("mongoose");

const PacienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number, required: true },
  genero: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dataNascimento: { type: Date, required: true },
  endereco: {
    rua: { type: String },
    numero: { type: String },
    cidade: { type: String },
    estado: { type: String },
    cep: { type: String },
  },
  tabagista: { type: Boolean, required: true },
  alcool: { type: Boolean, required: true },
  covid: { type: Boolean, required: true },
  sequelas: { type: String },
  alergias: { type: String },
  suplementacao: { type: String, required: true },
  suplementacaoDescricao: { type: String },
  refeicoes: { type: String, required: true },
  carne: { type: String, required: true },
  lanches: { type: String, required: true },
  refrigerante: { type: String, required: true },
  frutas: { type: String, required: true },
  leite: { type: String, required: true },
  madrugada: { type: String, required: true },
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
      termo1: { type: Boolean },
      termo2: { type: Boolean },
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
      contratanteAssinatura: { type: String },
      contratadaAssinatura: { type: String },
    },
  ],
});

const Paciente = mongoose.model("Paciente", PacienteSchema);

module.exports = Paciente;