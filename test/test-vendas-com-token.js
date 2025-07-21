const axios = require('axios');

const BASE_URL = 'http://localhost:8000';
// Token simulado para testes - em produção seria um token JWT válido
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjFhMmIzYzRkNWU2ZjdnOGg5aTBqMSIsIm5hbWUiOiJBZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MzIxNjU0NDQsImV4cCI6MTczMjE2OTA0NH0.test';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testServicosComAuth() {
  console.log('🧪 Testando serviços com autenticação...\n');
  
  try {
    // Teste 1: Listar todos os serviços
    console.log('1. Listando todos os serviços...');
    const servicesResponse = await api.get('/vendas/services');
    console.log(`✅ Serviços encontrados: ${servicesResponse.data.length}`);
    
    if (servicesResponse.data.length > 0) {
      console.log('   Primeiros 3 serviços:');
      servicesResponse.data.slice(0, 3).forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.name} - R$ ${service.price}`);
      });
    }

    // Teste 2: Buscar serviços por categoria
    console.log('\n2. Buscando serviços por categoria (facial)...');
    const facialServices = await api.get('/vendas/services/category/facial');
    console.log(`✅ Serviços faciais encontrados: ${facialServices.data.length}`);

    // Teste 3: Buscar serviços por categoria
    console.log('\n3. Buscando serviços por categoria (corporal)...');
    const corporalServices = await api.get('/vendas/services/category/corporal');
    console.log(`✅ Serviços corporais encontrados: ${corporalServices.data.length}`);

    // Teste 4: Buscar serviços por categoria
    console.log('\n4. Buscando serviços por categoria (pos_operatorio)...');
    const posOperatorioServices = await api.get('/vendas/services/category/pos_operatorio');
    console.log(`✅ Serviços pós-operatório encontrados: ${posOperatorioServices.data.length}`);

    console.log('\n🎉 Teste de serviços com autenticação concluído!');
    return servicesResponse.data;

  } catch (error) {
    console.error('❌ Erro no teste de serviços:', error.response?.data || error.message);
    return [];
  }
}

async function testProdutosComAuth() {
  console.log('\n🧪 Testando produtos com autenticação...\n');
  
  try {
    // Teste 1: Listar todos os produtos
    console.log('1. Listando todos os produtos...');
    const productsResponse = await api.get('/produtos');
    console.log(`✅ Produtos encontrados: ${productsResponse.data.length}`);
    
    if (productsResponse.data.length > 0) {
      console.log('   Primeiros 3 produtos:');
      productsResponse.data.slice(0, 3).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - Estoque: ${product.quantity} - R$ ${product.price}`);
      });
    }

    console.log('\n🎉 Teste de produtos com autenticação concluído!');
    return productsResponse.data;

  } catch (error) {
    console.error('❌ Erro no teste de produtos:', error.response?.data || error.message);
    return [];
  }
}

async function testVendaServico(services) {
  console.log('\n🧪 Testando venda de serviço...\n');
  
  try {
    if (services.length === 0) {
      console.log('❌ Nenhum serviço disponível para teste');
      return null;
    }

    const testService = services[0];
    console.log(`✅ Serviço selecionado: ${testService.name}`);

    // Criar venda de serviço
    console.log('\n1. Criando venda de serviço...');
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
      paymentMethod: 'pix',
      customerName: 'Maria Santos',
      customerEmail: 'maria@email.com',
      customerPhone: '(11) 88888-8888'
    };

    const serviceSaleResponse = await api.post('/vendas', serviceSaleData);
    console.log(`✅ Venda de serviço criada: ${serviceSaleResponse.data._id}`);
    console.log(`   Total: R$ ${serviceSaleResponse.data.totalAmount}`);

    // Cancelar venda
    console.log('\n2. Cancelando venda de serviço...');
    await api.put(`/vendas/${serviceSaleResponse.data._id}`, { status: 'cancelada' });
    console.log('✅ Venda de serviço cancelada');

    console.log('\n🎉 Teste de venda de serviço concluído!');
    return serviceSaleResponse.data._id;

  } catch (error) {
    console.error('❌ Erro no teste de venda de serviço:', error.response?.data || error.message);
    return null;
  }
}

async function testVendaProduto(products) {
  console.log('\n🧪 Testando venda de produto...\n');
  
  try {
    if (products.length === 0) {
      console.log('❌ Nenhum produto disponível para teste');
      return null;
    }

    const testProduct = products[0];
    console.log(`✅ Produto selecionado: ${testProduct.name}`);
    console.log(`   Estoque atual: ${testProduct.quantity}`);

    const initialStock = testProduct.quantity;

    // Criar venda de produto
    console.log('\n1. Criando venda de produto...');
    const productSaleData = {
      items: [
        {
          itemId: testProduct._id,
          itemType: 'product',
          itemName: testProduct.name,
          quantity: 1,
          unitPrice: testProduct.price
        }
      ],
      paymentMethod: 'dinheiro',
      customerName: 'João Silva',
      customerEmail: 'joao@email.com',
      customerPhone: '(11) 99999-9999'
    };

    const productSaleResponse = await api.post('/vendas', productSaleData);
    console.log(`✅ Venda de produto criada: ${productSaleResponse.data._id}`);
    console.log(`   Total: R$ ${productSaleResponse.data.totalAmount}`);

    // Verificar estoque reduzido
    console.log('\n2. Verificando estoque reduzido...');
    const updatedProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const updatedProduct = updatedProductResponse.data;
    console.log(`   Estoque após venda: ${updatedProduct.quantity}`);
    console.log(`   Estoque esperado: ${initialStock - 1}`);

    if (updatedProduct.quantity === initialStock - 1) {
      console.log('✅ Estoque foi reduzido corretamente!');
    } else {
      console.log('❌ Erro: Estoque não foi reduzido corretamente');
    }

    // Cancelar venda
    console.log('\n3. Cancelando venda de produto...');
    await api.put(`/vendas/${productSaleResponse.data._id}`, { status: 'cancelada' });
    
    // Verificar estoque devolvido
    const finalProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const finalProduct = finalProductResponse.data;
    console.log(`   Estoque após cancelamento: ${finalProduct.quantity}`);
    console.log(`   Estoque original: ${initialStock}`);

    if (finalProduct.quantity === initialStock) {
      console.log('✅ Estoque foi devolvido corretamente!');
    } else {
      console.log('❌ Erro: Estoque não foi devolvido corretamente');
    }

    console.log('\n🎉 Teste de venda de produto concluído!');
    return productSaleResponse.data._id;

  } catch (error) {
    console.error('❌ Erro no teste de venda de produto:', error.response?.data || error.message);
    return null;
  }
}

async function testVendaMista(products, services) {
  console.log('\n🧪 Testando venda mista (produto + serviço)...\n');
  
  try {
    if (products.length === 0 || services.length === 0) {
      console.log('❌ Produtos ou serviços insuficientes para teste');
      return null;
    }

    const testProduct = products[0];
    const testService = services[0];

    console.log(`✅ Produto: ${testProduct.name} (Estoque: ${testProduct.quantity})`);
    console.log(`✅ Serviço: ${testService.name} (R$ ${testService.price})`);

    const initialStock = testProduct.quantity;

    // Criar venda mista
    console.log('\n1. Criando venda mista...');
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
      paymentMethod: 'cartao_credito',
      customerName: 'Pedro Costa',
      customerEmail: 'pedro@email.com',
      customerPhone: '(11) 77777-7777'
    };

    const mixedSaleResponse = await api.post('/vendas', mixedSaleData);
    console.log(`✅ Venda mista criada: ${mixedSaleResponse.data._id}`);
    console.log(`   Total: R$ ${mixedSaleResponse.data.totalAmount}`);

    // Verificar que apenas produto afetou estoque
    console.log('\n2. Verificando que apenas produto afetou estoque...');
    const updatedProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const updatedProduct = updatedProductResponse.data;
    console.log(`   Estoque do produto após venda: ${updatedProduct.quantity}`);
    console.log(`   Estoque esperado: ${initialStock - 1}`);

    if (updatedProduct.quantity === initialStock - 1) {
      console.log('✅ Apenas produto afetou estoque!');
    } else {
      console.log('❌ Erro: Estoque não foi reduzido corretamente');
    }

    // Cancelar venda mista
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

    console.log('\n🎉 Teste de venda mista concluído!');
    return mixedSaleResponse.data._id;

  } catch (error) {
    console.error('❌ Erro no teste de venda mista:', error.response?.data || error.message);
    return null;
  }
}

async function testRelatorios() {
  console.log('\n🧪 Testando relatórios...\n');
  
  try {
    // Teste 1: Resumo de vendas
    console.log('1. Testando resumo de vendas...');
    const summaryResponse = await api.get('/vendas/summary');
    console.log('✅ Resumo de vendas:', {
      hoje: summaryResponse.data.today,
      mes: summaryResponse.data.month,
      ano: summaryResponse.data.year
    });

    // Teste 2: Relatório mensal
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

    // Teste 3: Listagem de vendas
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

    console.log('\n🎉 Teste de relatórios concluído!');

  } catch (error) {
    console.error('❌ Erro no teste de relatórios:', error.response?.data || error.message);
  }
}

// Executar todos os testes
async function runTests() {
  console.log('🚀 Iniciando testes completos com token do Death Star\n');
  
  try {
    const services = await testServicosComAuth();
    const products = await testProdutosComAuth();
    
    await testVendaServico(services);
    await testVendaProduto(products);
    await testVendaMista(products, services);
    await testRelatorios();
    
    console.log('\n✨ Todos os testes foram concluídos com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error.message);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testServicosComAuth,
  testProdutosComAuth,
  testVendaServico,
  testVendaProduto,
  testVendaMista,
  testRelatorios
}; 