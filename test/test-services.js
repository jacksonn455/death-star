const axios = require('axios');

const BASE_URL = 'https://death-star.onrender.com';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'your-auth-token-here';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testServices() {
  console.log('🧪 Iniciando testes de serviços...\n');

  try {
    // Teste 1: Listar todos os serviços
    console.log('1. Testando listagem de serviços...');
    const servicesResponse = await api.get('/vendas/services');
    console.log(`✅ Serviços encontrados: ${servicesResponse.data.length}`);
    
    if (servicesResponse.data.length > 0) {
      console.log('   Primeiro serviço:', servicesResponse.data[0].name);
    }

    // Teste 2: Buscar serviços por categoria
    console.log('\n2. Testando busca por categoria (facial)...');
    const facialServices = await api.get('/vendas/services/category/facial');
    console.log(`✅ Serviços faciais encontrados: ${facialServices.data.length}`);

    // Teste 3: Buscar serviços por categoria
    console.log('\n3. Testando busca por categoria (corporal)...');
    const corporalServices = await api.get('/vendas/services/category/corporal');
    console.log(`✅ Serviços corporais encontrados: ${corporalServices.data.length}`);

    // Teste 4: Buscar serviços por categoria
    console.log('\n4. Testando busca por categoria (pos_operatorio)...');
    const posOperatorioServices = await api.get('/vendas/services/category/pos_operatorio');
    console.log(`✅ Serviços pós-operatório encontrados: ${posOperatorioServices.data.length}`);

    // Teste 5: Criar uma venda com serviço
    console.log('\n5. Testando criação de venda com serviço...');
    if (servicesResponse.data.length > 0) {
      const firstService = servicesResponse.data[0];
      
      const saleData = {
        items: [
          {
            itemId: firstService._id,
            itemType: 'service',
            itemName: firstService.name,
            quantity: 1,
            unitPrice: firstService.price,
            category: firstService.category,
            duration: firstService.duration
          }
        ],
        paymentMethod: 'pix',
        customerName: 'Teste Serviço',
        customerEmail: 'teste@email.com',
        customerPhone: '(11) 99999-9999'
      };

      const saleResponse = await api.post('/vendas', saleData);
      console.log(`✅ Venda com serviço criada: ${saleResponse.data._id}`);
      console.log(`   Total da venda: R$ ${saleResponse.data.totalAmount}`);
    }

    // Teste 6: Verificar relatório mensal
    console.log('\n6. Testando relatório mensal...');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    const reportResponse = await api.get(`/vendas/report?year=${year}&month=${month}`);
    console.log(`✅ Relatório gerado para ${year}-${month}`);
    console.log(`   Total de vendas: ${reportResponse.data.totalSales}`);
    console.log(`   Receita total: R$ ${reportResponse.data.totalRevenue}`);

    console.log('\n🎉 Todos os testes de serviços foram executados com sucesso!');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.response?.data || error.message);
  }
}

async function testServiceCRUD() {
  console.log('\n🧪 Testando CRUD de serviços...\n');

  try {
    // Teste 1: Criar serviço
    console.log('1. Criando novo serviço...');
    const newService = {
      name: 'Teste Serviço',
      category: 'facial',
      duration: '30 min',
      price: 100.00,
      description: 'Serviço de teste'
    };

    const createResponse = await api.post('/vendas/services', newService);
    console.log(`✅ Serviço criado: ${createResponse.data._id}`);
    const serviceId = createResponse.data._id;

    // Teste 2: Buscar serviço por ID
    console.log('\n2. Buscando serviço por ID...');
    const getResponse = await api.get(`/vendas/services/${serviceId}`);
    console.log(`✅ Serviço encontrado: ${getResponse.data.name}`);

    // Teste 3: Atualizar serviço
    console.log('\n3. Atualizando serviço...');
    const updateData = {
      price: 150.00,
      description: 'Serviço de teste atualizado'
    };

    const updateResponse = await api.put(`/vendas/services/${serviceId}`, updateData);
    console.log(`✅ Serviço atualizado: R$ ${updateResponse.data.price}`);

    // Teste 4: Deletar serviço
    console.log('\n4. Deletando serviço...');
    await api.delete(`/vendas/services/${serviceId}`);
    console.log('✅ Serviço deletado');

    console.log('\n🎉 Testes CRUD de serviços concluídos com sucesso!');

  } catch (error) {
    console.error('❌ Erro nos testes CRUD:', error.response?.data || error.message);
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes de serviços do Death Star\n');
  
  await testServices();
  await testServiceCRUD();
  
  console.log('\n✨ Todos os testes foram concluídos!');
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testServices, testServiceCRUD }; 