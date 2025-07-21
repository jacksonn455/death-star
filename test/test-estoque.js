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

async function testEstoque() {
  console.log('🧪 Iniciando testes de controle de estoque...\n');

  try {
    // Teste 1: Buscar produtos disponíveis
    console.log('1. Buscando produtos disponíveis...');
    const productsResponse = await api.get('/produtos');
    const products = productsResponse.data.filter(p => p.quantity > 0);
    
    if (products.length === 0) {
      console.log('❌ Nenhum produto com estoque disponível encontrado');
      return;
    }

    const testProduct = products[0];
    console.log(`✅ Produto selecionado: ${testProduct.name}`);
    console.log(`   Estoque atual: ${testProduct.quantity}`);
    console.log(`   Preço: R$ ${testProduct.price}`);

    const initialStock = testProduct.quantity;
    const quantityToSell = Math.min(2, initialStock); // Vende 2 ou menos se estoque for menor

    // Teste 2: Criar venda com produto
    console.log(`\n2. Criando venda com ${quantityToSell} unidades do produto...`);
    const saleData = {
      items: [
        {
          itemId: testProduct._id,
          itemType: 'product',
          itemName: testProduct.name,
          quantity: quantityToSell,
          unitPrice: testProduct.price
        }
      ],
      paymentMethod: 'pix',
      customerName: 'Teste Estoque',
      customerEmail: 'teste@email.com',
      customerPhone: '(11) 99999-9999'
    };

    const saleResponse = await api.post('/vendas', saleData);
    console.log(`✅ Venda criada: ${saleResponse.data._id}`);
    console.log(`   Total da venda: R$ ${saleResponse.data.totalAmount}`);

    // Teste 3: Verificar se estoque foi reduzido
    console.log('\n3. Verificando se estoque foi reduzido...');
    const updatedProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const updatedProduct = updatedProductResponse.data;
    
    const expectedStock = initialStock - quantityToSell;
    console.log(`   Estoque anterior: ${initialStock}`);
    console.log(`   Estoque atual: ${updatedProduct.quantity}`);
    console.log(`   Estoque esperado: ${expectedStock}`);
    
    if (updatedProduct.quantity === expectedStock) {
      console.log('✅ Estoque foi reduzido corretamente!');
    } else {
      console.log('❌ Erro: Estoque não foi reduzido corretamente');
    }

    // Teste 4: Tentar vender mais do que tem em estoque
    console.log('\n4. Testando venda com quantidade maior que estoque...');
    const invalidSaleData = {
      items: [
        {
          itemId: testProduct._id,
          itemType: 'product',
          itemName: testProduct.name,
          quantity: updatedProduct.quantity + 10, // Mais do que tem em estoque
          unitPrice: testProduct.price
        }
      ],
      paymentMethod: 'pix',
      customerName: 'Teste Estoque Inválido',
      customerEmail: 'teste@email.com',
      customerPhone: '(11) 99999-9999'
    };

    try {
      await api.post('/vendas', invalidSaleData);
      console.log('❌ Erro: Venda deveria ter falhado por estoque insuficiente');
    } catch (error) {
      if (error.response?.status === 500 && error.response?.data?.error?.includes('Estoque insuficiente')) {
        console.log('✅ Venda corretamente rejeitada por estoque insuficiente');
      } else {
        console.log('❌ Erro inesperado:', error.response?.data || error.message);
      }
    }

    // Teste 5: Cancelar venda e verificar se estoque volta
    console.log('\n5. Cancelando venda e verificando devolução do estoque...');
    const saleId = saleResponse.data._id;
    
    await api.put(`/vendas/${saleId}`, { status: 'cancelada' });
    console.log('✅ Venda cancelada');

    // Verificar estoque após cancelamento
    const finalProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const finalProduct = finalProductResponse.data;
    
    console.log(`   Estoque após cancelamento: ${finalProduct.quantity}`);
    console.log(`   Estoque original: ${initialStock}`);
    
    if (finalProduct.quantity === initialStock) {
      console.log('✅ Estoque foi devolvido corretamente após cancelamento!');
    } else {
      console.log('❌ Erro: Estoque não foi devolvido corretamente');
    }

    // Teste 6: Deletar venda e verificar se estoque volta novamente
    console.log('\n6. Deletando venda e verificando devolução do estoque...');
    await api.delete(`/vendas/${saleId}`);
    console.log('✅ Venda deletada');

    // Verificar estoque após deleção
    const deletedProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const deletedProduct = deletedProductResponse.data;
    
    console.log(`   Estoque após deleção: ${deletedProduct.quantity}`);
    console.log(`   Estoque original: ${initialStock}`);
    
    if (deletedProduct.quantity === initialStock) {
      console.log('✅ Estoque foi devolvido corretamente após deleção!');
    } else {
      console.log('❌ Erro: Estoque não foi devolvido corretamente');
    }

    console.log('\n🎉 Todos os testes de controle de estoque foram executados com sucesso!');

  } catch (error) {
    console.error('❌ Erro nos testes de estoque:', error.response?.data || error.message);
  }
}

async function testVendaComProdutoEServico() {
  console.log('\n🧪 Testando venda com produto e serviço...\n');

  try {
    // Buscar produtos e serviços
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

    // Criar venda com produto e serviço
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
      paymentMethod: 'pix',
      customerName: 'Teste Misto',
      customerEmail: 'teste@email.com',
      customerPhone: '(11) 99999-9999'
    };

    const mixedSaleResponse = await api.post('/vendas', mixedSaleData);
    console.log(`✅ Venda mista criada: ${mixedSaleResponse.data._id}`);
    console.log(`   Total da venda: R$ ${mixedSaleResponse.data.totalAmount}`);

    // Verificar se apenas o estoque do produto foi reduzido
    const updatedProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const updatedProduct = updatedProductResponse.data;
    
    console.log(`   Estoque do produto após venda: ${updatedProduct.quantity}`);
    console.log(`   Estoque esperado: ${initialStock - 1}`);
    
    if (updatedProduct.quantity === initialStock - 1) {
      console.log('✅ Estoque do produto foi reduzido corretamente!');
    } else {
      console.log('❌ Erro: Estoque do produto não foi reduzido corretamente');
    }

    // Cancelar venda e verificar se estoque volta
    const mixedSaleId = mixedSaleResponse.data._id;
    await api.put(`/vendas/${mixedSaleId}`, { status: 'cancelada' });
    
    const finalProductResponse = await api.get(`/produtos/${testProduct._id}`);
    const finalProduct = finalProductResponse.data;
    
    console.log(`   Estoque após cancelamento: ${finalProduct.quantity}`);
    console.log(`   Estoque original: ${initialStock}`);
    
    if (finalProduct.quantity === initialStock) {
      console.log('✅ Estoque foi devolvido corretamente após cancelamento!');
    } else {
      console.log('❌ Erro: Estoque não foi devolvido corretamente');
    }

    console.log('\n🎉 Teste de venda mista concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste de venda mista:', error.response?.data || error.message);
  }
}

// Executar testes
async function runEstoqueTests() {
  console.log('🚀 Iniciando testes de controle de estoque do Death Star\n');
  
  await testEstoque();
  await testVendaComProdutoEServico();
  
  console.log('\n✨ Todos os testes de estoque foram concluídos!');
}

// Executar se chamado diretamente
if (require.main === module) {
  runEstoqueTests().catch(console.error);
}

module.exports = { testEstoque, testVendaComProdutoEServico }; 