const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const TEST_EMAIL = 'admin@test.com';
const TEST_PASSWORD = 'admin123';

async function testSalesSummary() {
  console.log('🧪 Testando resumo de vendas...\n');

  try {
    // 1. Login para obter token
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    const authToken = loginResponse.data.accessToken;
    console.log('✅ Login realizado com sucesso\n');

    // 2. Buscar resumo de vendas
    console.log('2️⃣ Buscando resumo de vendas...');
    const summaryResponse = await axios.get(`${BASE_URL}/vendas/summary`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const summary = summaryResponse.data;
    console.log('✅ Resumo obtido com sucesso');
    console.log('📊 Dados do resumo:', JSON.stringify(summary, null, 2));

    // 3. Verificar estrutura dos dados
    console.log('\n3️⃣ Verificando estrutura dos dados...');
    
    if (summary.today && typeof summary.today.sales === 'number' && typeof summary.today.revenue === 'number') {
      console.log('✅ Estrutura "today" está correta');
    } else {
      console.log('❌ Estrutura "today" está incorreta');
    }

    if (summary.month && typeof summary.month.sales === 'number' && typeof summary.month.revenue === 'number') {
      console.log('✅ Estrutura "month" está correta');
    } else {
      console.log('❌ Estrutura "month" está incorreta');
    }

    if (summary.year && typeof summary.year.sales === 'number' && typeof summary.year.revenue === 'number') {
      console.log('✅ Estrutura "year" está correta');
    } else {
      console.log('❌ Estrutura "year" está incorreta');
    }

    // 4. Verificar valores
    console.log('\n4️⃣ Verificando valores...');
    console.log(`📈 Vendas hoje: ${summary.today?.sales || 0}`);
    console.log(`💰 Receita hoje: R$ ${(summary.today?.revenue || 0).toFixed(2)}`);
    console.log(`📈 Vendas do mês: ${summary.month?.sales || 0}`);
    console.log(`💰 Receita do mês: R$ ${(summary.month?.revenue || 0).toFixed(2)}`);
    console.log(`📈 Vendas do ano: ${summary.year?.sales || 0}`);
    console.log(`💰 Receita do ano: R$ ${(summary.year?.revenue || 0).toFixed(2)}`);

    // 5. Testar formatação de moeda
    console.log('\n5️⃣ Testando formatação de moeda...');
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value || 0);
    };

    console.log(`💰 Receita hoje formatada: ${formatCurrency(summary.today?.revenue)}`);
    console.log(`💰 Receita do mês formatada: ${formatCurrency(summary.month?.revenue)}`);
    console.log(`💰 Receita do ano formatada: ${formatCurrency(summary.year?.revenue)}`);

    console.log('\n🎉 Teste de resumo de vendas concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Executar teste se este arquivo for executado diretamente
if (require.main === module) {
  testSalesSummary();
}

module.exports = { testSalesSummary }; 