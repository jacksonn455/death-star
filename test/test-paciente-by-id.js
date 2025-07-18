const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000';

async function testPacienteById() {
  console.log('🧪 Testando busca de paciente por ID...\n');

  try {
    // 1. Autenticação
    console.log('1️⃣ Fazendo autenticação...');
    const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: "test@example.com",
      password: "test123"
    });
    
    const { accessToken } = authResponse.data;
    const authHeader = { Authorization: `Bearer ${accessToken}` };
    console.log('✅ Autenticação realizada com sucesso');

    // 2. Buscar paciente específico (usando o ID do seu exemplo)
    const pacienteId = "687a830b5fa50ccce9edb48b";
    console.log(`\n2️⃣ Buscando paciente com ID: ${pacienteId}`);
    
    const pacienteResponse = await axios.get(`${API_BASE_URL}/pacientes/${pacienteId}`, {
      headers: authHeader
    });
    
    const paciente = pacienteResponse.data;
    console.log('✅ Paciente encontrado com sucesso');
    
    // 3. Verificar todos os dados retornados
    console.log('\n3️⃣ Verificando dados do paciente:');
    console.log('📋 Informações Pessoais:');
    console.log('   - Nome:', paciente.nome);
    console.log('   - Idade:', paciente.idade);
    console.log('   - Profissão:', paciente.profissao);
    console.log('   - CPF:', paciente.cpf);
    console.log('   - RG:', paciente.rg);
    console.log('   - Contato:', paciente.contato);
    console.log('   - Endereço:', paciente.endereco);
    console.log('   - Escolaridade:', paciente.escolaridade);
    console.log('   - Estado Civil:', paciente.estadoCivil);
    console.log('   - Imagem:', paciente.image ? 'Sim' : 'Não');

    console.log('\n📋 Primeira Consulta:');
    console.log('   - Queixa:', paciente.queixa);
    console.log('   - Soube do trabalho:', paciente.soubeDoTrabalho);

    console.log('\n📋 Histórico da Queixa:');
    console.log('   - Início da queixa:', paciente.inicioQueixa);
    console.log('   - Intensificação:', paciente.intensificacaoQueixa);
    console.log('   - Tratamentos anteriores:', paciente.tratamentosAnteriores);
    console.log('   - Uso de produtos:', paciente.usoProdutos);

    console.log('\n📋 Patologias:');
    console.log('   - Patologias:', paciente.patologias);

    console.log('\n📋 Conhecendo Mais Sobre Você:');
    console.log('   - Funcionamento intestinal:', paciente.funcionamentoIntestinal);
    console.log('   - Gestante:', paciente.gestante);
    console.log('   - Contraceptivo:', paciente.contraceptivo);
    console.log('   - Ciclo menstrual:', paciente.cicloMenstrual);
    console.log('   - Última gestação:', paciente.ultimaGestacao);
    console.log('   - Qualidade do sono:', paciente.qualidadeSono);
    console.log('   - Ansiedade:', paciente.ansiedade);
    console.log('   - Nervosismo:', paciente.nervosismo);
    console.log('   - Exercício:', paciente.exercicio);

    console.log('\n📋 Hábitos e Alimentação:');
    console.log('   - Tabagista:', paciente.tabagista);
    console.log('   - Álcool:', paciente.alcool);
    console.log('   - COVID:', paciente.covid);
    console.log('   - Sequelas:', paciente.sequelas);
    console.log('   - Alergias:', paciente.alergias);
    console.log('   - Suplementação:', paciente.suplementacao);
    console.log('   - Descrição suplementação:', paciente.suplementacaoDescricao);
    console.log('   - Refeições:', paciente.refeicoes);
    console.log('   - Carne:', paciente.carne);
    console.log('   - Lanches:', paciente.lanches);
    console.log('   - Refrigerante:', paciente.refrigerante);
    console.log('   - Frutas:', paciente.frutas);
    console.log('   - Leite:', paciente.leite);
    console.log('   - Madrugada:', paciente.madrugada);
    console.log('   - Último horário:', paciente.ultimoHorario);
    console.log('   - Horário dorme:', paciente.horarioDorme);
    console.log('   - Intolerância:', paciente.intolerancia);

    console.log('\n📋 Condições da Pele:');
    console.log('   - Melasma:', paciente.melasma);
    console.log('   - Manchas:', paciente.manchas);
    console.log('   - Linhas:', paciente.linhas);
    console.log('   - Acne:', paciente.acne);
    console.log('   - Grau:', paciente.grau);
    console.log('   - Região acne:', paciente.regiaoAcne);
    console.log('   - Cicatriz:', paciente.cicatriz);
    console.log('   - Tipo cicatriz:', paciente.tipoCicatriz);
    console.log('   - Olheiras:', paciente.olheiras);
    console.log('   - Tipo olheiras:', paciente.tipoOlheiras);

    console.log('\n📋 Tratamento:');
    if (paciente.tratamento) {
      console.log('   - Diagnóstico:', paciente.tratamento.diagnostico);
      console.log('   - Descrição:', paciente.tratamento.descricao);
      console.log('   - Conduta:', paciente.tratamento.conduta);
      console.log('   - Valor:', paciente.tratamento.valor);
      console.log('   - Data:', paciente.tratamento.data);
      console.log('   - Assinatura:', paciente.tratamento.assinatura ? 'Sim' : 'Não');
      console.log('   - Termos aceitos:', paciente.tratamento.termosAceitos);
    } else {
      console.log('   - Tratamento não encontrado');
    }

    console.log('\n📋 Tratamento Sugerido:');
    if (paciente.tratamentoSugerido) {
      console.log('   - Tratamento:', paciente.tratamentoSugerido.tratamento);
      console.log('   - Número de sessões:', paciente.tratamentoSugerido.numeroSessao);
      console.log('   - Valor por sessão:', paciente.tratamentoSugerido.valorSessao);
      console.log('   - Valor total:', paciente.tratamentoSugerido.valorTotal);
      console.log('   - Pré-agendamento:', paciente.tratamentoSugerido.preAgendamento);
      console.log('   - Horário:', paciente.tratamentoSugerido.horario);
    } else {
      console.log('   - Tratamento sugerido não encontrado');
    }

    console.log('\n📋 Contrato e Assinaturas:');
    if (paciente.contratoAssinaturas && paciente.contratoAssinaturas.length > 0) {
      console.log('   - Número de assinaturas:', paciente.contratoAssinaturas.length);
      paciente.contratoAssinaturas.forEach((assinatura, index) => {
        console.log(`     * Assinatura ${index + 1}:`);
        console.log(`       - Contratante: ${assinatura.contratanteAssinatura ? 'Sim' : 'Não'}`);
        console.log(`       - Contratada: ${assinatura.contratadaAssinatura ? 'Sim' : 'Não'}`);
        console.log(`       - Data: ${assinatura.data}`);
      });
    } else {
      console.log('   - Contrato assinaturas não encontradas');
    }

    console.log('\n📋 Contract Signatures:');
    if (paciente.contractSignatures) {
      console.log('   - Cliente:', paciente.contractSignatures.clientSignature ? 'Sim' : 'Não');
      console.log('   - Profissional:', paciente.contractSignatures.providerSignature ? 'Sim' : 'Não');
    } else {
      console.log('   - Contract signatures não encontradas');
    }

    console.log('\n🎉 Teste de busca de paciente por ID concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.log('\n💡 Dica: O paciente pode não existir no banco de dados local');
      console.log('   Tente criar um paciente primeiro ou usar um ID válido');
    }
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testPacienteById();
}

module.exports = { testPacienteById }; 