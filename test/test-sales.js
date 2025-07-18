const axios = require('axios');
const BASE_URL = 'http://localhost:8000';
const TOKEN = 'seu_token_aqui';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testCreateSale() {
  try {
    console.log('🛒 Testando criação de venda...');
    
    const saleData = {
      items: [
        {
          productId: "64f1a2b3c4d5e6f7g8h9i0j1", 
          productName: "Paracetamol 500mg",
          quantity: 2,
          unitPrice: 5.50
        },
        {
          productId: "64f1a2b3c4d5e6f7g8h9i0j2", 
          productName: "Ibuprofeno 600mg",
          quantity: 1,
          unitPrice: 8.00
        }
      ],
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      customerPhone: "(11) 99999-9999",
      paymentMethod: "dinheiro",
      notes: "Cliente preferiu pagamento em dinheiro"
    };

    const response = await api.post('/vendas', saleData);
    console.log('✅ Venda criada com sucesso:', response.data);
    return response.data._id;
  } catch (error) {
    console.error('❌ Erro ao criar venda:', error.response?.data || error.message);
  }
}


async function testGetAllSales() {
  try {
    console.log('📋 Testando listagem de vendas...');
    
    const response = await api.get('/vendas');
    console.log('✅ Vendas encontradas:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar vendas:', error.response?.data || error.message);
  }
}


async function testGetSaleById(saleId) {
  try {
    console.log(`🔍 Testando busca de venda por ID: ${saleId}...`);
    
    const response = await api.get(`/vendas/${saleId}`);
    console.log('✅ Venda encontrada:', response.data);
  } catch (error) {
    console.error('❌ Erro ao buscar venda por ID:', error.response?.data || error.message);
  }
}


async function testUpdateSale(saleId) {
  try {
    console.log(`✏️ Testando atualização de venda: ${saleId}...`);
    
    const updateData = {
      status: "cancelada",
      notes: "Cliente cancelou a compra"
    };

    const response = await api.put(`/vendas/${saleId}`, updateData);
    console.log('✅ Venda atualizada:', response.data);
  } catch (error) {
    console.error('❌ Erro ao atualizar venda:', error.response?.data || error.message);
  }
}


async function testSalesSummary() {
  try {
    console.log('📊 Testando resumo de vendas...');
    
    const response = await api.get('/vendas/summary');
    console.log('✅ Resumo de vendas:', response.data);
  } catch (error) {
    console.error('❌ Erro ao buscar resumo:', error.response?.data || error.message);
  }
}


async function testMonthlyReport() {
  try {
    console.log('📈 Testando relatório mensal...');
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    const response = await api.get(`/vendas/report?year=${year}&month=${month}`);
    console.log('✅ Relatório mensal:', response.data);
  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error.response?.data || error.message);
  }
}


async function testSalesFilters() {
  try {
    console.log('🔍 Testando filtros de vendas...');
    
    const filters = {
      status: 'concluida',
      paymentMethod: 'dinheiro',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    };

    const queryString = new URLSearchParams(filters).toString();
    const response = await api.get(`/vendas?${queryString}`);
    console.log('✅ Vendas filtradas:', response.data.length);
  } catch (error) {
    console.error('❌ Erro ao filtrar vendas:', error.response?.data || error.message);
  }
}


async function runTests() {
  console.log('🚀 Iniciando testes do módulo de vendas...\n');

  
  const saleId = await testCreateSale();
  
  if (saleId) {
    
    await testGetSaleById(saleId);
    
    
    await testUpdateSale(saleId);
  }

  
  await testGetAllSales();
  
  
  await testSalesSummary();
  
  
  await testMonthlyReport();
  
  
  await testSalesFilters();

  console.log('\n✅ Todos os testes concluídos!');
}


if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testCreateSale,
  testGetAllSales,
  testGetSaleById,
  testUpdateSale,
  testSalesSummary,
  testMonthlyReport,
  testSalesFilters,
  runTests
}; 