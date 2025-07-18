const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000';

// Dados de teste para anamnese completa
const anamneseTestData = {
  // Informações Pessoais
  nome: "Maria Silva",
  idade: 35,
  profissao: "Advogada",
  dataNascimento: "1988-05-15",
  cpf: "123.456.789-00",
  rg: "12.345.678-9",
  contato: "(11) 99999-9999",
  endereco: "Rua das Flores, 123 - São Paulo/SP",
  escolaridade: "Superior Completo",
  estadoCivil: "Casada",

  // Primeira Consulta
  queixa: "Manchas escuras no rosto e linhas de expressão",
  soubeDoTrabalho: "Indicação de amiga",

  // Histórico da Queixa
  inicioQueixa: "Há 2 anos",
  intensificacaoQueixa: "Após exposição solar excessiva",
  tratamentosAnteriores: "Já fez peeling químico e uso de cremes",
  usoProdutos: "Protetor solar, hidratante e vitamina C",

  // Histórico de Patologias
  patologias: ["Diabetes Tipo 2", "Hipertensão", "Controlado com medicação"],

  // Conhecendo Mais Sobre Você
  funcionamentoIntestinal: "Todos os dias",
  gestante: "Não",
  contraceptivo: "Pílula",
  cicloMenstrual: "28 dias",
  ultimaGestacao: "5 anos atrás",
  qualidadeSono: "8H",
  ansiedade: "Moderado",
  nervosismo: "Moderado",
  exercicio: "3X na semana",

  // Hábitos e Alimentação
  tabagista: "nao",
  alcool: "3x na semana",
  covid: "Sim",
  sequelas: "Perda de olfato por 3 meses",
  alergias: "Nenhuma conhecida",
  suplementacao: "Sim",
  suplementacaoDescricao: "Vitamina D e Ômega 3",
  refeicoes: "5x ao dia",
  carne: "3x na semana",
  lanches: "1x na semana",
  refrigerante: "Não ingere",
  frutas: "Todos os dias",
  leite: "Todos os dias",
  madrugada: "Não",
  ultimoHorario: "20:00",
  horarioDorme: "23:00",
  intolerancia: "Nenhuma",

  // Condições da Pele
  melasma: "Misto",
  manchas: ["Solares", "Hormonais"],
  linhas: ["Testa", "Ao redor dos olhos"],
  acne: "Não apresenta",
  grau: "",
  regiaoAcne: [],
  cicatriz: "Não apresenta",
  tipoCicatriz: [],
  olheiras: "Apresenta",
  tipoOlheiras: ["Estrutural", "Vascular"],

  // Tratamento
  tratamento: {
    diagnostico: "Melasma misto e linhas de expressão",
    descricao: "Tratamento com peeling e preenchimento",
    conduta: "6 sessões de peeling + 2 sessões de preenchimento",
    valor: "R$ 2.500,00",
    data: "2024-01-15",
    assinatura: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    termosAceitos: {
      termo1: true,
      termo2: true,
    },
  },

  // Tratamento Sugerido
  tratamentoSugerido: {
    tratamento: "Peeling + Preenchimento",
    numeroSessao: 8,
    valorSessao: 312.50,
    valorTotal: 2500.00,
    preAgendamento: "15/01/2024",
    horario: "14:00",
  },

  // Contrato e Assinaturas
  contratoAssinaturas: [
    {
      contratanteAssinatura: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      contratadaAssinatura: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      data: new Date("2024-01-15"),
    },
  ],

  // Assinaturas do Contrato de Serviços Estéticos
  contractSignatures: {
    clientSignature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    providerSignature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  },
};

async function testAnamnese() {
  console.log('🧪 Iniciando testes de anamnese...\n');

  try {
    // 0. Autenticação primeiro
    console.log('0️⃣ Fazendo autenticação...');
    const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: "test@example.com",
      password: "test123"
    });
    
    const { accessToken } = authResponse.data;
    const authHeader = { Authorization: `Bearer ${accessToken}` };
    console.log('✅ Autenticação realizada com sucesso');

    // 1. Criar um paciente básico primeiro
    console.log('1️⃣ Criando paciente básico...');
    const pacienteResponse = await axios.post(`${API_BASE_URL}/pacientes`, {
      nome: "Maria Silva",
      idade: 35,
      dataNascimento: "1988-05-15",
    }, { headers: authHeader });
    
    const pacienteId = pacienteResponse.data._id;
    console.log('✅ Paciente criado com ID:', pacienteId);

    // 2. Criar anamnese completa
    console.log('\n2️⃣ Criando anamnese completa...');
    const createAnamneseResponse = await axios.post(
      `${API_BASE_URL}/pacientes/${pacienteId}/anamnese`,
      anamneseTestData,
      { headers: authHeader }
    );
    console.log('✅ Anamnese criada com sucesso');

    // 3. Buscar anamnese
    console.log('\n3️⃣ Buscando anamnese...');
    const getAnamneseResponse = await axios.get(
      `${API_BASE_URL}/pacientes/${pacienteId}/anamnese`,
      { headers: authHeader }
    );
    
    const anamneseData = getAnamneseResponse.data;
    console.log('✅ Anamnese encontrada');
    console.log('   - Nome:', anamneseData.nome);
    console.log('   - Idade:', anamneseData.idade);
    console.log('   - Queixa:', anamneseData.queixa);
    console.log('   - Patologias:', anamneseData.patologias.length, 'itens');

    // 4. Atualizar anamnese
    console.log('\n4️⃣ Atualizando anamnese...');
    const updateData = {
      ...anamneseTestData,
      queixa: "Manchas escuras no rosto, linhas de expressão e olheiras",
      patologias: [...anamneseTestData.patologias, "Histórico de queloide"],
    };

    const updateAnamneseResponse = await axios.put(
      `${API_BASE_URL}/pacientes/${pacienteId}/anamnese`,
      updateData,
      { headers: authHeader }
    );
    console.log('✅ Anamnese atualizada com sucesso');

    // 5. Verificar atualização
    console.log('\n5️⃣ Verificando atualização...');
    const updatedAnamneseResponse = await axios.get(
      `${API_BASE_URL}/pacientes/${pacienteId}/anamnese`,
      { headers: authHeader }
    );
    
    const updatedAnamnese = updatedAnamneseResponse.data;
    console.log('✅ Anamnese atualizada verificada');
    console.log('   - Queixa atualizada:', updatedAnamnese.queixa);
    console.log('   - Patologias atualizadas:', updatedAnamnese.patologias.length, 'itens');

    // 6. Buscar paciente completo
    console.log('\n6️⃣ Buscando paciente completo...');
    const pacienteCompletoResponse = await axios.get(
      `${API_BASE_URL}/pacientes/${pacienteId}`,
      { headers: authHeader }
    );
    
    const pacienteCompleto = pacienteCompletoResponse.data;
    console.log('✅ Paciente completo encontrado');
    console.log('   - Nome:', pacienteCompleto.nome);
    console.log('   - Tratamento:', pacienteCompleto.tratamento?.diagnostico);
    console.log('   - Tratamento Sugerido:', pacienteCompleto.tratamentoSugerido?.tratamento);

    console.log('\n🎉 Todos os testes de anamnese passaram com sucesso!');

  } catch (error) {
    console.error('❌ Erro nos testes de anamnese:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testAnamnese();
}

module.exports = { testAnamnese }; 