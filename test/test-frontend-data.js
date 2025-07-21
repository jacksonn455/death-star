const axios = require("axios");

const API_BASE_URL = "http://localhost:8000";

const frontendData = {
  nome: "Jackson Teste",
  idade: 25,
  profissao: "Desenvolvedor",
  dataNascimento: "1998-05-15",
  cpf: "123.456.789-00",
  rg: "12.345.678-9",
  contato: "(11) 99999-9999",
  endereco: "Rua Teste, 123",
  escolaridade: "Superior",
  estadoCivil: "Solteiro",

  queixa: "Manchas no rosto",
  soubeDoTrabalho: "Indicação",

  inicioQueixa: "Há 1 ano",
  intensificacaoQueixa: "Após sol",
  tratamentosAnteriores: "Nenhum",
  usoProdutos: "Protetor solar",

  funcionamentoIntestinal: "Todos os dias",
  gestante: "Não",
  contraceptivo: "Não",
  cicloMenstrual: "28 dias",
  ultimaGestacao: "Nunca",
  qualidadeSono: "8H",
  ansiedade: "Baixo",
  nervosismo: "Baixo",
  exercicio: "3X na semana",

  diagnostico: "Melasma",
  descricao: "Tratamento com peeling",
  conduta: "6 sessões",
  valor: "R$ 1.200,00",
  data: "2024-01-15",
  assinatura:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  termo1: "true",
  termo2: "true",

  patologias: "Diabetes,Hipertensão",
  manchas: "Solares,Hormonais",
  linhas: "Testa,Ao redor dos olhos",
  regiaoAcne: "Testa,Nariz",
  tipoCicatriz: "Queloide,Atrofica",
  tipoOlheiras: "Estrutural,Vascular",

  "contratoAssinaturas[0][contratanteAssinatura]":
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "contratoAssinaturas[0][contratadaAssinatura]":
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "contratoAssinaturas[0][data]": "2024-01-15",
  "contratoAssinaturas[1][contratanteAssinatura]":
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "contratoAssinaturas[1][contratadaAssinatura]":
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "contratoAssinaturas[1][data]": "2024-01-16",

  clientSignature:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  providerSignature:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
};

async function testFrontendData() {
  console.log("🧪 Testando processamento de dados do frontend...\n");

  try {
    console.log("1️⃣ Fazendo autenticação...");
    const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: "test@example.com",
      password: "test123",
    });

    const { accessToken } = authResponse.data;
    const authHeader = { Authorization: `Bearer ${accessToken}` };
    console.log("✅ Autenticação realizada com sucesso");

    console.log("\n2️⃣ Criando paciente com dados do frontend...");
    const pacienteResponse = await axios.post(
      `${API_BASE_URL}/pacientes`,
      frontendData,
      {
        headers: { ...authHeader, "Content-Type": "application/json" },
      }
    );

    const pacienteId = pacienteResponse.data._id;
    console.log("✅ Paciente criado com ID:", pacienteId);

    console.log("\n3️⃣ Verificando dados processados...");
    const pacienteCompleto = pacienteResponse.data;

    console.log("📋 Dados processados:");
    console.log("   - Nome:", pacienteCompleto.nome);
    console.log("   - Idade:", pacienteCompleto.idade);
    console.log("   - Queixa:", pacienteCompleto.queixa);

    if (pacienteCompleto.tratamento) {
      console.log("   ✅ Tratamento processado:");
      console.log(
        "     * Diagnóstico:",
        pacienteCompleto.tratamento.diagnostico
      );
      console.log("     * Descrição:", pacienteCompleto.tratamento.descricao);
      console.log("     * Conduta:", pacienteCompleto.tratamento.conduta);
      console.log("     * Valor:", pacienteCompleto.tratamento.valor);
      console.log("     * Data:", pacienteCompleto.tratamento.data);
      console.log(
        "     * Assinatura:",
        pacienteCompleto.tratamento.assinatura ? "Sim" : "Não"
      );
      console.log("     * Termos:", pacienteCompleto.tratamento.termosAceitos);
    } else {
      console.log("   ❌ Tratamento não processado");
    }

    console.log("   - Patologias:", pacienteCompleto.patologias);
    console.log("   - Manchas:", pacienteCompleto.manchas);
    console.log("   - Linhas:", pacienteCompleto.linhas);
    console.log("   - Região Acne:", pacienteCompleto.regiaoAcne);
    console.log("   - Tipo Cicatriz:", pacienteCompleto.tipoCicatriz);
    console.log("   - Tipo Olheiras:", pacienteCompleto.tipoOlheiras);

    if (
      pacienteCompleto.contratoAssinaturas &&
      pacienteCompleto.contratoAssinaturas.length > 0
    ) {
      console.log(
        "   ✅ Contrato assinaturas processadas:",
        pacienteCompleto.contratoAssinaturas.length,
        "assinatura(s)"
      );
    } else {
      console.log("   ❌ Contrato assinaturas não processadas");
    }

    if (pacienteCompleto.contractSignatures) {
      console.log("   ✅ Contract signatures processadas:");
      console.log(
        "     * Cliente:",
        pacienteCompleto.contractSignatures.clientSignature ? "Sim" : "Não"
      );
      console.log(
        "     * Profissional:",
        pacienteCompleto.contractSignatures.providerSignature ? "Sim" : "Não"
      );
    } else {
      console.log("   ❌ Contract signatures não processadas");
    }

    console.log("\n🎉 Teste de processamento de dados do frontend concluído!");
  } catch (error) {
    console.error("❌ Erro no teste:", error.response?.data || error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testFrontendData();
}

module.exports = { testFrontendData };
