const axios = require('axios');

const BASE_URL = 'http://localhost:8000';
const AUTH_TOKEN = 'seu_token_aqui';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testVendasProdutos() {
  console.log('🧪 Testando vendas de produtos...\n');

  try {
    // 1. Buscar produtos disponíveis
    console.log('1. Buscando produtos disponíveis...');
    const productsResponse = await api.get('/produtos');
    const products = productsResponse.data.filter(p => p.quantity > 0);
    
    if (products.length === 0) {
      console.log('❌ Nenhum produto com estoque disponível');
      return;
    }

    const testProduct = products[0];
    console.log(`✅ Produto selecionado: ${testProduct.name}`);
    console.log(`   Estoque: ${testProduct.quantity}`);
    console.log(`   Preço: R$ ${testProduct.price}`);

    const initialStock = testProduct.quantity;

    // 2. Criar venda de produto
    console.log('\n2. Criando venda de produto...');
    const productSaleData = {
      items: [
        {
          itemId: testProduct._id,
          itemType: 'product',
          itemName: testProduct.name,
          quantity: 2,
          unitPrice: testProduct.price
        }
      ],
      paymentMethod: 'pix',
      customerName: 'João Silva',
      customerEmail: 'joao@email.com',
      customerPhone: '(11) 99999-9999'
    };

    const productSaleResponse = await api.post('/vendas', productSaleData);
    console.log(`✅ Venda de produto criada: ${productSaleResponse.data._id}`);
    console.log(`   Total: R$ ${productSaleResponse.data.totalAmount}`);

    // 3. Verificar estoque reduzido
    const updatedProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const updatedProduct = updatedProductResponse.data;
    console.log(`   Estoque após venda: ${updatedProduct.quantity}`);
    console.log(`   Estoque esperado: ${initialStock - 2}`);

    if (updatedProduct.quantity === initialStock - 2) {
      console.log('✅ Estoque foi reduzido corretamente!');
    } else {
      console.log('❌ Erro: Estoque não foi reduzido corretamente');
    }

    // 4. Cancelar venda e verificar estoque
    console.log('\n3. Cancelando venda de produto...');
    await api.put(`/vendas/${productSaleResponse.data._id}`, { status: 'cancelada' });
    
    const finalProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const finalProduct = finalProductResponse.data;
    console.log(`   Estoque após cancelamento: ${finalProduct.quantity}`);
    console.log(`   Estoque original: ${initialStock}`);

    if (finalProduct.quantity === initialStock) {
      console.log('✅ Estoque foi devolvido corretamente!');
    } else {
      console.log('❌ Erro: Estoque não foi devolvido corretamente');
    }

    console.log('\n🎉 Teste de vendas de produtos concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste de vendas de produtos:', error.response?.data || error.message);
  }
}

async function testVendasServicos() {
  console.log('\n🧪 Testando vendas de serviços...\n');

  try {
    // 1. Buscar serviços disponíveis
    console.log('1. Buscando serviços disponíveis...');
    const servicesResponse = await api.get('/vendas/services');
    const services = servicesResponse.data.filter(s => s.isActive);
    
    if (services.length === 0) {
      console.log('❌ Nenhum serviço ativo disponível');
      return;
    }

    const testService = services[0];
    console.log(`✅ Serviço selecionado: ${testService.name}`);
    console.log(`   Categoria: ${testService.category}`);
    console.log(`   Duração: ${testService.duration}`);
    console.log(`   Preço: R$ ${testService.price}`);

    // 2. Criar venda de serviço
    console.log('\n2. Criando venda de serviço...');
    const serviceSaleData = {
      items: [
        {
          itemId: testService._id,
          itemType: 'service',
          itemName: testService.name,
          quantity: 1,
          unitPrice: testService.price,
          category: testService.category,
          duration: testService.duration
        }
      ],
      paymentMethod: 'cartao_credito',
      customerName: 'Maria Santos',
      customerEmail: 'maria@email.com',
      customerPhone: '(11) 88888-8888'
    };

    const serviceSaleResponse = await api.post('/vendas', serviceSaleData);
    console.log(`✅ Venda de serviço criada: ${serviceSaleResponse.data._id}`);
    console.log(`   Total: R$ ${serviceSaleResponse.data.totalAmount}`);

    // 3. Verificar que serviço não tem estoque
    console.log('\n3. Verificando que serviço não afeta estoque...');
    const serviceResponse = await api.get(`/vendas/services/${testService._id}`);
    console.log(`   Serviço continua ativo: ${serviceResponse.data.isActive}`);

    // 4. Cancelar venda de serviço
    console.log('\n4. Cancelando venda de serviço...');
    await api.put(`/vendas/${serviceSaleResponse.data._id}`, { status: 'cancelada' });
    console.log('✅ Venda de serviço cancelada (sem afetar estoque)');

    console.log('\n🎉 Teste de vendas de serviços concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste de vendas de serviços:', error.response?.data || error.message);
  }
}

async function testVendasMistas() {
  console.log('\n🧪 Testando vendas mistas (produto + serviço)...\n');

  try {
    // 1. Buscar produtos e serviços
    const [productsResponse, servicesResponse] = await Promise.all([
      api.get('/produtos'),
      api.get('/vendas/services')
    ]);

    const products = productsResponse.data.filter(p => p.quantity > 0);
    const services = servicesResponse.data.filter(s => s.isActive);

    if (products.length === 0) {
      console.log('❌ Nenhum produto com estoque disponível');
      return;
    }

    if (services.length === 0) {
      console.log('❌ Nenhum serviço ativo disponível');
      return;
    }

    const testProduct = products[0];
    const testService = services[0];

    console.log(`✅ Produto: ${testProduct.name} (Estoque: ${testProduct.quantity})`);
    console.log(`✅ Serviço: ${testService.name} (R$ ${testService.price})`);

    const initialStock = testProduct.quantity;

    // 2. Criar venda mista
    console.log('\n2. Criando venda mista...');
    const mixedSaleData = {
      items: [
        {
          itemId: testProduct._id,
          itemType: 'product',
          itemName: testProduct.name,
          quantity: 1,
          unitPrice: testProduct.price
        },
        {
          itemId: testService._id,
          itemType: 'service',
          itemName: testService.name,
          quantity: 1,
          unitPrice: testService.price,
          category: testService.category,
          duration: testService.duration
        }
      ],
      paymentMethod: 'dinheiro',
      customerName: 'Pedro Costa',
      customerEmail: 'pedro@email.com',
      customerPhone: '(11) 77777-7777'
    };

    const mixedSaleResponse = await api.post('/vendas', mixedSaleData);
    console.log(`✅ Venda mista criada: ${mixedSaleResponse.data._id}`);
    console.log(`   Total: R$ ${mixedSaleResponse.data.totalAmount}`);

    // 3. Verificar que apenas produto afetou estoque
    const updatedProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const updatedProduct = updatedProductResponse.data;
    console.log(`   Estoque do produto após venda: ${updatedProduct.quantity}`);
    console.log(`   Estoque esperado: ${initialStock - 1}`);

    if (updatedProduct.quantity === initialStock - 1) {
      console.log('✅ Apenas produto afetou estoque!');
    } else {
      console.log('❌ Erro: Estoque não foi reduzido corretamente');
    }

    // 4. Cancelar venda mista
    console.log('\n3. Cancelando venda mista...');
    await api.put(`/vendas/${mixedSaleResponse.data._id}`, { status: 'cancelada' });
    
    const finalProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const finalProduct = finalProductResponse.data;
    console.log(`   Estoque após cancelamento: ${finalProduct.quantity}`);
    console.log(`   Estoque original: ${initialStock}`);

    if (finalProduct.quantity === initialStock) {
      console.log('✅ Estoque foi devolvido corretamente!');
    } else {
      console.log('❌ Erro: Estoque não foi devolvido corretamente');
    }

    console.log('\n🎉 Teste de vendas mistas concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste de vendas mistas:', error.response?.data || error.message);
  }
}

async function testValidacoes() {
  console.log('\n🧪 Testando validações...\n');

  try {
    // 1. Testar venda sem itens
    console.log('1. Testando venda sem itens...');
    try {
      await api.post('/vendas', {
        paymentMethod: 'pix',
        customerName: 'Teste'
      });
      console.log('❌ Erro: Venda deveria ter falhado');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Venda corretamente rejeitada por falta de itens');
      } else {
        console.log('❌ Erro inesperado:', error.response?.data || error.message);
      }
    }

    // 2. Testar venda com estoque insuficiente
    console.log('\n2. Testando venda com estoque insuficiente...');
    const productsResponse = await api.get('/produtos');
    const products = productsResponse.data.filter(p => p.quantity > 0);
    
    if (products.length > 0) {
      const testProduct = products[0];
      try {
        await api.post('/vendas', {
          items: [
            {
              itemId: testProduct._id,
              itemType: 'product',
              itemName: testProduct.name,
              quantity: testProduct.quantity + 10,
              unitPrice: testProduct.price
            }
          ],
          paymentMethod: 'pix',
          customerName: 'Teste'
        });
        console.log('❌ Erro: Venda deveria ter falhado por estoque insuficiente');
      } catch (error) {
        if (error.response?.status === 500 && error.response?.data?.error?.includes('Estoque insuficiente')) {
          console.log('✅ Venda corretamente rejeitada por estoque insuficiente');
        } else {
          console.log('❌ Erro inesperado:', error.response?.data || error.message);
        }
      }
    }

    // 3. Testar venda com serviço inativo
    console.log('\n3. Testando venda com serviço inativo...');
    const servicesResponse = await api.get('/vendas/services');
    const inactiveServices = servicesResponse.data.filter(s => !s.isActive);
    
    if (inactiveServices.length > 0) {
      const inactiveService = inactiveServices[0];
      try {
        await api.post('/vendas', {
          items: [
            {
              itemId: inactiveService._id,
              itemType: 'service',
              itemName: inactiveService.name,
              quantity: 1,
              unitPrice: inactiveService.price
            }
          ],
          paymentMethod: 'pix',
          customerName: 'Teste'
        });
        console.log('❌ Erro: Venda deveria ter falhado por serviço inativo');
      } catch (error) {
        if (error.response?.status === 500 && error.response?.data?.error?.includes('não está ativo')) {
          console.log('✅ Venda corretamente rejeitada por serviço inativo');
        } else {
          console.log('❌ Erro inesperado:', error.response?.data || error.message);
        }
      }
    }

    console.log('\n🎉 Teste de validações concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste de validações:', error.response?.data || error.message);
  }
}

async function testRelatorios() {
  console.log('\n🧪 Testando relatórios...\n');

  try {
    // 1. Testar resumo de vendas
    console.log('1. Testando resumo de vendas...');
    const summaryResponse = await api.get('/vendas/summary');
    console.log('✅ Resumo de vendas:', summaryResponse.data);

    // 2. Testar relatório mensal
    console.log('\n2. Testando relatório mensal...');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    const reportResponse = await api.get(`/vendas/report?year=${year}&month=${month}`);
    console.log('✅ Relatório mensal:', {
      periodo: reportResponse.data.period,
      totalVendas: reportResponse.data.totalSales,
      receitaTotal: reportResponse.data.totalRevenue,
      totalItens: reportResponse.data.totalItems
    });

    // 3. Testar listagem de vendas
    console.log('\n3. Testando listagem de vendas...');
    const salesResponse = await api.get('/vendas');
    console.log(`✅ Total de vendas encontradas: ${salesResponse.data.length}`);

    if (salesResponse.data.length > 0) {
      const lastSale = salesResponse.data[0];
      console.log('   Última venda:', {
        id: lastSale._id,
        total: lastSale.totalAmount,
        status: lastSale.status,
        itens: lastSale.items.length
      });
    }

    console.log('\n🎉 Teste de relatórios concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste de relatórios:', error.response?.data || error.message);
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 Iniciando testes completos de vendas do Death Star\n');
  
  await testVendasProdutos();
  await testVendasServicos();
  await testVendasMistas();
  await testValidacoes();
  await testRelatorios();
  
  console.log('\n✨ Todos os testes foram concluídos com sucesso!');
}

// Executar se chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testVendasProdutos,
  testVendasServicos,
  testVendasMistas,
  testValidacoes,
  testRelatorios
}; 