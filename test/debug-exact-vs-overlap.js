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
      notes: 'Teste de conflito',
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

async function testExactVsOverlap() {
  console.log('\n🔍 TESTE: Conflito Exato vs Sobreposição Parcial');
  console.log('==================================================');
  
  try {
    // 1. Criar primeiro agendamento: 10:00-11:00
    console.log('\n1. Criando primeiro agendamento: 10:00-11:00');
    const firstAppointment = await createAppointment('2024-02-01', '10:00', 'Paciente A');
    console.log('📝 ID do primeiro agendamento:', firstAppointment._id);
    
    // 2. Tentar criar segundo agendamento: 10:00-11:00 (conflito exato)
    console.log('\n2. Tentando criar segundo agendamento: 10:00-11:00 (conflito exato)');
    try {
      await createAppointment('2024-02-01', '10:00', 'Paciente B');
      console.log('❌ ERRO: Conflito exato foi permitido!');
    } catch (error) {
      console.log('📝 Status:', error.response?.status);
      console.log('📝 Erro:', error.response?.data);
      if (error.response?.status === 400 && error.response.data.error.includes('Já existe um agendamento para essa data e horário')) {
        console.log('✅ CORRETO: Conflito exato detectado corretamente');
      } else {
        console.log('❌ ERRO INESPERADO');
      }
    }
    
    // 3. Tentar criar terceiro agendamento: 10:30-11:30 (sobreposição parcial)
    console.log('\n3. Tentando criar terceiro agendamento: 10:30-11:30 (sobreposição parcial)');
    try {
      await createAppointment('2024-02-01', '10:30', 'Paciente C');
      console.log('❌ ERRO: Sobreposição parcial foi permitida!');
    } catch (error) {
      console.log('📝 Status:', error.response?.status);
      console.log('📝 Erro:', error.response?.data);
      if (error.response?.status === 400) {
        if (error.response.data.error.includes('sobreposição')) {
          console.log('✅ CORRETO: Sobreposição parcial detectada');
        } else if (error.response.data.error.includes('Já existe um agendamento')) {
          console.log('⚠️ PROBLEMA: Detectou conflito exato em vez de sobreposição parcial');
        } else {
          console.log('⚠️ Mensagem inesperada:', error.response.data.error);
        }
      } else {
        console.log('❌ ERRO INESPERADO');
      }
    }
    
    // 4. Tentar criar quarto agendamento: 09:30-10:30 (sobreposição parcial)
    console.log('\n4. Tentando criar quarto agendamento: 09:30-10:30 (sobreposição parcial)');
    try {
      await createAppointment('2024-02-01', '09:30', 'Paciente D');
      console.log('❌ ERRO: Sobreposição parcial foi permitida!');
    } catch (error) {
      console.log('📝 Status:', error.response?.status);
      console.log('📝 Erro:', error.response?.data);
      if (error.response?.status === 400) {
        if (error.response.data.error.includes('sobreposição')) {
          console.log('✅ CORRETO: Sobreposição parcial detectada');
        } else if (error.response.data.error.includes('Já existe um agendamento')) {
          console.log('⚠️ PROBLEMA: Detectou conflito exato em vez de sobreposição parcial');
        } else {
          console.log('⚠️ Mensagem inesperada:', error.response.data.error);
        }
      } else {
        console.log('❌ ERRO INESPERADO');
      }
    }
    
    // 5. Criar quinto agendamento: 11:00-12:00 (consecutivo - deve funcionar)
    console.log('\n5. Criando quinto agendamento: 11:00-12:00 (consecutivo)');
    try {
      await createAppointment('2024-02-01', '11:00', 'Paciente E');
      console.log('✅ CORRETO: Agendamento consecutivo criado com sucesso');
    } catch (error) {
      console.log('❌ ERRO: Agendamento consecutivo falhou:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.log('❌ Erro geral no teste:', error.message);
  }
}

async function cleanup() {
  console.log('\n🧹 Limpando dados de teste...');
  try {
    const response = await axios.get(`${BASE_URL}/agenda?paciente=Teste`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.data && response.data.data.length > 0) {
      for (const planner of response.data.data) {
        try {
          await axios.delete(`${BASE_URL}/agenda/${planner._id}`, {
            headers: { Authorization: `Bearer ${authToken}` }
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
  console.log('🚀 Iniciando teste de conflito exato vs sobreposição parcial...\n');
  
  try {
    await login();
    await testExactVsOverlap();
  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  } finally {
    await cleanup();
  }
  
  console.log('\n🏁 Teste concluído!');
}

main(); 