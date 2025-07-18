const axios = require('axios');
const moment = require('moment-timezone');

const BASE_URL = 'http://localhost:8000';
let authToken = '';

async function login() {
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@test.com',
      password: 'admin123'
    });
    authToken = loginResponse.data.accessToken;
    console.log('✅ Login realizado com sucesso');
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data || error.message);
    throw error;
  }
}

function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };
}

async function createAppointment(date, time, paciente = 'Teste Paciente') {
  try {
    const response = await axios.post(`${BASE_URL}/agenda`, {
      paciente,
      service: 'Consulta',
      contact: '11999999999',
      responsible: 'Dr. Teste',
      notes: 'Teste de validação',
      date,
      time
    }, {
      headers: getAuthHeaders()
    });
    console.log(`✅ Agendamento criado: ${date} ${time} - ${paciente}`);
    return response.data;
  } catch (error) {
    console.log(`❌ Erro ao criar agendamento ${date} ${time}:`, error.response?.data || error.message);
    throw error;
  }
}

async function testScenario1_ExactConflict() {
  console.log('\n🔍 CENÁRIO 1: Conflito exato (mesmo horário)');
  
  try {
    // Criar primeiro agendamento
    await createAppointment('2024-02-10', '10:00', 'Paciente A');
    
    // Tentar criar segundo agendamento no mesmo horário
    try {
      await createAppointment('2024-02-10', '10:00', 'Paciente B');
      console.log('❌ ERRO: Conflito exato foi permitido!');
      return false;
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.error.includes('Já existe um agendamento')) {
        console.log('✅ CORRETO: Conflito exato detectado');
        return true;
      } else {
        console.log('❌ ERRO INESPERADO:', error.response?.data || error.message);
        return false;
      }
    }
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    return false;
  }
}

async function testScenario2_PartialOverlap() {
  console.log('\n🔍 CENÁRIO 2: Sobreposição parcial');
  
  try {
    // Criar primeiro agendamento: 10:00-11:00
    await createAppointment('2024-02-11', '10:00', 'Paciente C');
    
    // Tentar criar segundo agendamento: 10:30-11:30 (sobreposição)
    try {
      await createAppointment('2024-02-11', '10:30', 'Paciente D');
      console.log('❌ ERRO: Sobreposição parcial foi permitida!');
      return false;
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.error.includes('sobreposição')) {
        console.log('✅ CORRETO: Sobreposição parcial detectada');
        return true;
      } else {
        console.log('❌ ERRO INESPERADO:', error.response?.data || error.message);
        return false;
      }
    }
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    return false;
  }
}

async function testScenario3_ConsecutiveValid() {
  console.log('\n🔍 CENÁRIO 3: Agendamentos consecutivos válidos');
  
  try {
    // Criar primeiro agendamento: 10:00-11:00
    await createAppointment('2024-02-12', '10:00', 'Paciente E');
    
    // Criar segundo agendamento: 11:00-12:00 (consecutivo)
    await createAppointment('2024-02-12', '11:00', 'Paciente F');
    
    console.log('✅ CORRETO: Agendamentos consecutivos criados com sucesso');
    return true;
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    return false;
  }
}

async function testScenario4_DifferentDatesValid() {
  console.log('\n🔍 CENÁRIO 4: Mesmo horário em datas diferentes');
  
  try {
    // Criar primeiro agendamento: dia 1, 10:00
    await createAppointment('2024-02-13', '10:00', 'Paciente G');
    
    // Criar segundo agendamento: dia 2, 10:00 (mesmo horário, data diferente)
    await createAppointment('2024-02-14', '10:00', 'Paciente H');
    
    console.log('✅ CORRETO: Mesmo horário em datas diferentes funcionou');
    return true;
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    return false;
  }
}

async function testScenario5_UpdateConflict() {
  console.log('\n🔍 CENÁRIO 5: Atualizar para horário ocupado');
  
  try {
    // Criar primeiro agendamento
    const firstAppointment = await createAppointment('2024-02-15', '10:00', 'Paciente I');
    
    // Criar segundo agendamento em horário diferente
    const secondAppointment = await createAppointment('2024-02-15', '11:00', 'Paciente J');
    
    // Tentar atualizar o segundo para o horário do primeiro
    try {
      await axios.put(`${BASE_URL}/agenda/${secondAppointment._id}`, {
        date: '2024-02-15',
        time: '10:00'
      }, {
        headers: getAuthHeaders()
      });
      
      console.log('❌ ERRO: Atualização para horário ocupado foi permitida!');
      return false;
    } catch (error) {
      console.log(`🔍 DEBUG: Status: ${error.response?.status}, Error: ${JSON.stringify(error.response?.data)}`);
      if ((error.response?.status === 400 || error.response?.status === 500) && 
          (error.response.data.error.includes('Já existe um agendamento') || 
           error.response.data.error.includes('sobreposição'))) {
        console.log('✅ CORRETO: Atualização para horário ocupado foi bloqueada');
        return true;
      } else {
        console.log('❌ ERRO INESPERADO:', error.response?.data || error.message);
        return false;
      }
    }
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    return false;
  }
}

async function cleanup() {
  console.log('\n🧹 Limpando dados de teste...');
  try {
    // Clean appointments with test patient names
    const testPatients = [
      'Paciente A', 'Paciente B', 'Paciente C', 'Paciente D', 
      'Paciente E', 'Paciente F', 'Paciente G', 'Paciente H',
      'Paciente I', 'Paciente J', 'Teste Paciente'
    ];
    
    for (const patient of testPatients) {
      try {
        const response = await axios.get(`${BASE_URL}/agenda?paciente=${encodeURIComponent(patient)}`, {
          headers: getAuthHeaders()
        });
        
        if (response.data.data && response.data.data.length > 0) {
          for (const planner of response.data.data) {
            try {
              await axios.delete(`${BASE_URL}/agenda/${planner._id}`, {
                headers: getAuthHeaders()
              });
              console.log(`🗑️ Deletado: ${planner.paciente} - ${planner.date} ${planner.time}`);
            } catch (error) {
              console.log(`⚠️ Erro ao deletar agendamento ${planner._id}:`, error.response?.data || error.message);
            }
          }
        }
      } catch (error) {
        console.log(`⚠️ Erro ao buscar agendamentos para ${patient}:`, error.response?.data || error.message);
      }
    }
    
    // Also clean appointments with "Teste" in the name
    try {
      const response = await axios.get(`${BASE_URL}/agenda?paciente=Teste`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.data && response.data.data.length > 0) {
        for (const planner of response.data.data) {
          try {
            await axios.delete(`${BASE_URL}/agenda/${planner._id}`, {
              headers: getAuthHeaders()
            });
            console.log(`🗑️ Deletado: ${planner.paciente} - ${planner.date} ${planner.time}`);
          } catch (error) {
            console.log(`⚠️ Erro ao deletar agendamento ${planner._id}:`, error.response?.data || error.message);
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Erro na limpeza geral:', error.response?.data || error.message);
    }
    
    console.log('✅ Limpeza concluída');
  } catch (error) {
    console.log('⚠️ Erro na limpeza:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando testes corrigidos de validação de agendamentos...\n');
  
  const results = {
    scenario1: false,
    scenario2: false,
    scenario3: false,
    scenario4: false,
    scenario5: false
  };
  
  try {
    await login();
    
    // Clean up before running tests
    console.log('🧹 Limpando dados anteriores...');
    await cleanup();
    
    results.scenario1 = await testScenario1_ExactConflict();
    results.scenario2 = await testScenario2_PartialOverlap();
    results.scenario3 = await testScenario3_ConsecutiveValid();
    results.scenario4 = await testScenario4_DifferentDatesValid();
    results.scenario5 = await testScenario5_UpdateConflict();
    
    console.log('\n📊 RESULTADOS DOS TESTES:');
    console.log('=====================================');
    console.log(`✅ Cenário 1 - Conflito exato: ${results.scenario1 ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Cenário 2 - Sobreposição parcial: ${results.scenario2 ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Cenário 3 - Agendamentos consecutivos: ${results.scenario3 ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Cenário 4 - Mesmo horário em datas diferentes: ${results.scenario4 ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Cenário 5 - Atualizar para horário ocupado: ${results.scenario5 ? 'PASS' : 'FAIL'}`);
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n📈 RESUMO: ${passedTests}/${totalTests} cenários passaram`);
    
    if (passedTests === totalTests) {
      console.log('🎉 TODOS OS TESTES PASSARAM! A validação está funcionando perfeitamente!');
    } else {
      console.log('⚠️ Alguns testes falharam. Verifique a implementação.');
    }
    
  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  } finally {
    await cleanup();
  }
  
  console.log('\n🏁 Teste concluído!');
}

main(); 