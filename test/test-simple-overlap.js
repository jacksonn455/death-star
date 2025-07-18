const axios = require('axios');

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
      notes: 'Teste de sobreposição',
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

async function testSimpleOverlap() {
  console.log('\n🔍 TESTE SIMPLES DE SOBREPOSIÇÃO');
  console.log('==================================');
  
  try {
    // 1. Criar primeiro agendamento: 10:00-11:00
    console.log('\n1. Criando primeiro agendamento: 10:00-11:00');
    await createAppointment('2024-02-05', '10:00', 'Paciente A');
    
    // 2. Tentar criar segundo agendamento: 10:30-11:30 (sobreposição parcial)
    console.log('\n2. Tentando criar segundo agendamento: 10:30-11:30 (sobreposição parcial)');
    try {
      await createAppointment('2024-02-05', '10:30', 'Paciente B');
      console.log('❌ ERRO: Sobreposição parcial foi permitida!');
    } catch (error) {
      console.log('📝 Status:', error.response?.status);
      console.log('📝 Erro:', error.response?.data);
      if (error.response?.status === 400) {
        console.log('✅ CORRETO: Erro 400 retornado');
        if (error.response.data.error.includes('sobreposição')) {
          console.log('✅ CORRETO: Mensagem de sobreposição detectada');
        } else {
          console.log('⚠️ Mensagem inesperada:', error.response.data.error);
        }
      } else {
        console.log('❌ ERRO INESPERADO');
      }
    }
    
  } catch (error) {
    console.log('❌ Erro geral no teste:', error.message);
  }
}

async function cleanup() {
  console.log('\n🧹 Limpando dados de teste...');
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
        } catch (error) {
          console.log(`⚠️ Erro ao deletar agendamento ${planner._id}:`, error.response?.data || error.message);
        }
      }
    }
    console.log('✅ Limpeza concluída');
  } catch (error) {
    console.log('⚠️ Erro na limpeza:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando teste simples de sobreposição...\n');
  
  try {
    await login();
    await testSimpleOverlap();
  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  } finally {
    await cleanup();
  }
  
  console.log('\n🏁 Teste concluído!');
}

main(); 