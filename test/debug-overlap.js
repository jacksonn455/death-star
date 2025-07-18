const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

async function login() {
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'test123'
    });
    authToken = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data || error.message);
    throw error;
  }
}

async function createAppointment(date, time, paciente = 'Teste Paciente') {
  try {
    const response = await axios.post(`${BASE_URL}/planner`, {
      date,
      time,
      service: 'Consulta',
      paciente,
      responsible: 'Dr. Teste'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Agendamento criado: ${date} ${time} - ${paciente}`);
    return response.data;
  } catch (error) {
    console.log(`❌ Erro ao criar agendamento ${date} ${time}:`, error.response?.data || error.message);
    throw error;
  }
}

async function testPartialOverlap() {
  console.log('\n🔍 TESTE DE SOBREPOSIÇÃO PARCIAL');
  console.log('=====================================');
  
  try {
    // Criar primeiro agendamento: 14:00-15:00
    console.log('\n1. Criando primeiro agendamento (14:00-15:00)...');
    await createAppointment('2024-01-15', '14:00', 'Paciente A');
    
    // Tentar criar segundo agendamento: 14:30-15:30 (sobreposição parcial)
    console.log('\n2. Tentando criar segundo agendamento (14:30-15:30) - DEVE FALHAR...');
    try {
      await createAppointment('2024-01-15', '14:30', 'Paciente B');
      console.log('❌ ERRO: Segundo agendamento foi criado quando deveria falhar!');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ CORRETO: Segundo agendamento foi rejeitado com erro 400');
        console.log('📝 Mensagem de erro:', error.response.data.error);
      } else {
        console.log('❌ ERRO INESPERADO:', error.response?.status, error.response?.data);
      }
    }
    
    // Tentar criar terceiro agendamento: 13:30-14:30 (sobreposição parcial)
    console.log('\n3. Tentando criar terceiro agendamento (13:30-14:30) - DEVE FALHAR...');
    try {
      await createAppointment('2024-01-15', '13:30', 'Paciente C');
      console.log('❌ ERRO: Terceiro agendamento foi criado quando deveria falhar!');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ CORRETO: Terceiro agendamento foi rejeitado com erro 400');
        console.log('📝 Mensagem de erro:', error.response.data.error);
      } else {
        console.log('❌ ERRO INESPERADO:', error.response?.status, error.response?.data);
      }
    }
    
    // Criar quarto agendamento: 15:00-16:00 (consecutivo - deve funcionar)
    console.log('\n4. Criando quarto agendamento (15:00-16:00) - DEVE FUNCIONAR...');
    try {
      await createAppointment('2024-01-15', '15:00', 'Paciente D');
      console.log('✅ CORRETO: Quarto agendamento consecutivo foi criado com sucesso');
    } catch (error) {
      console.log('❌ ERRO: Quarto agendamento consecutivo falhou:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.log('❌ Erro geral no teste:', error.message);
  }
}

async function cleanup() {
  console.log('\n🧹 Limpando dados de teste...');
  try {
    // Buscar e deletar agendamentos de teste
    const response = await axios.get(`${BASE_URL}/planner?paciente=Teste`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.data && response.data.data.length > 0) {
      for (const planner of response.data.data) {
        try {
          await axios.delete(`${BASE_URL}/planner/${planner._id}`, {
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
  console.log('🚀 Iniciando debug de sobreposições parciais...\n');
  
  try {
    await login();
    await testPartialOverlap();
  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  } finally {
    await cleanup();
  }
  
  console.log('\n🏁 Debug concluído!');
}

main(); 