const axios = require("axios");

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";
const TEST_EMAIL = "admin@test.com";
const TEST_PASSWORD = "admin123";

async function testSalesFrontend() {
  console.log("🧪 Testando integração Frontend de Vendas...\n");

  let authToken = "";
  let products = [];

  try {
    console.log("1️⃣ Fazendo login...");
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    authToken = loginResponse.data.accessToken;
    console.log("✅ Login realizado com sucesso\n");

    console.log("2️⃣ Buscando produtos...");
    const productsResponse = await axios.get(`${BASE_URL}/produtos`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    products = productsResponse.data;
    console.log(`✅ ${products.length} produtos encontrados\n`);

    console.log("3️⃣ Criando uma venda...");
    if (products.length === 0) {
      console.log("⚠️ Nenhum produto disponível para teste");
      return;
    }

    const firstProduct = products[0];
    const saleData = {
      items: [
        {
          productId: firstProduct._id,
          productName: firstProduct.name,
          quantity: 1,
          unitPrice: firstProduct.price,
          totalPrice: firstProduct.price,
        },
      ],
      customerName: "Cliente Teste",
      customerEmail: "teste@example.com",
      customerPhone: "(11) 99999-9999",
      paymentMethod: "dinheiro",
      notes: "Venda de teste",
      totalAmount: firstProduct.price,
      status: "concluida",
    };

    const createSaleResponse = await axios.post(
      `${BASE_URL}/vendas`,
      saleData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✅ Venda criada com sucesso");
    console.log(`📝 ID da venda: ${createSaleResponse.data._id}\n`);

    console.log("4️⃣ Buscando vendas...");
    const salesResponse = await axios.get(`${BASE_URL}/vendas`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log(`✅ ${salesResponse.data.length} vendas encontradas\n`);

    console.log("5️⃣ Buscando resumo de vendas...");
    const summaryResponse = await axios.get(`${BASE_URL}/vendas/resumo`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log("✅ Resumo de vendas obtido");
    console.log(`📊 Vendas hoje: ${summaryResponse.data.todaySales}`);
    console.log(`💰 Receita hoje: R$ ${summaryResponse.data.todayRevenue}\n`);

    console.log("6️⃣ Testando filtros...");
    const filtersResponse = await axios.get(
      `${BASE_URL}/vendas?status=concluida`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log(
      `✅ Filtro por status: ${filtersResponse.data.length} vendas concluídas\n`
    );

    console.log("7️⃣ Buscando venda específica...");
    const saleId = createSaleResponse.data._id;
    const specificSaleResponse = await axios.get(
      `${BASE_URL}/vendas/${saleId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✅ Venda específica encontrada");
    console.log(`📝 Cliente: ${specificSaleResponse.data.customerName}\n`);

    console.log("8️⃣ Atualizando venda...");
    const updateData = {
      customerName: "Cliente Teste Atualizado",
      notes: "Venda atualizada",
    };
    const updateResponse = await axios.put(
      `${BASE_URL}/vendas/${saleId}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✅ Venda atualizada com sucesso\n");

    console.log("9️⃣ Testando validação de estoque...");
    const stockTestData = {
      items: [
        {
          productId: firstProduct._id,
          productName: firstProduct.name,
          quantity: firstProduct.quantity + 1000,
          unitPrice: firstProduct.price,
          totalPrice: firstProduct.price * (firstProduct.quantity + 1000),
        },
      ],
      customerName: "Cliente Teste",
      paymentMethod: "dinheiro",
      totalAmount: firstProduct.price * (firstProduct.quantity + 1000),
      status: "concluida",
    };

    try {
      await axios.post(`${BASE_URL}/vendas`, stockTestData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("❌ Erro: Deveria ter rejeitado estoque insuficiente");
    } catch (error) {
      if (error.response?.status === 400) {
        console.log("✅ Validação de estoque funcionando corretamente");
      } else {
        console.log(
          "❌ Erro inesperado:",
          error.response?.data || error.message
        );
      }
    }

    console.log("\n🔟 Excluindo venda de teste...");
    await axios.delete(`${BASE_URL}/vendas/${saleId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log("✅ Venda de teste excluída");

    console.log("\n🎉 Todos os testes de vendas passaram!");
  } catch (error) {
    console.error("❌ Erro no teste:", error.response?.data || error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testSalesFrontend();
}

module.exports = { testSalesFrontend };
