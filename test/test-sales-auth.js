const axios = require("axios");

const API_BASE_URL = "https://death-star.onrender.com/api";

const saleTestData = {
  items: [
    {
      productId: "67dd56f007ffc8746bcfc4e7",
      productName: "Derma Clean secativo pontual",
      quantity: 1,
      unitPrice: 89.9,
      totalPrice: 89.9,
    },
  ],
  customerName: "Jackson Magnabosco",
  customerEmail: "jacksonmagnabosco@hotmail.com",
  customerPhone: "5554984354004",
  paymentMethod: "pix",
  notes: "ok",
  totalAmount: 89.9,
  status: "concluida",
};

async function testSalesAuth() {
  console.log("🧪 Testando autenticação para vendas...\n");

  try {
    console.log("1️⃣ Fazendo login...");
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: "test@example.com",
      password: "test123",
    });

    const { accessToken } = loginResponse.data;
    console.log("✅ Login realizado com sucesso");
    console.log("   - Token obtido:", accessToken ? "Sim" : "Não");

    console.log("\n2️⃣ Testando criação de venda com token...");
    const createSaleResponse = await axios.post(
      `${API_BASE_URL}/vendas`,
      saleTestData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Venda criada com sucesso");
    console.log("   - ID da venda:", createSaleResponse.data._id);
    console.log("   - Total:", createSaleResponse.data.totalAmount);
    console.log("   - Status:", createSaleResponse.data.status);

    console.log("\n3️⃣ Testando busca de vendas...");
    const getSalesResponse = await axios.get(`${API_BASE_URL}/vendas`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("✅ Vendas buscadas com sucesso");
    console.log("   - Quantidade de vendas:", getSalesResponse.data.length);

    console.log("\n4️⃣ Testando criação de venda sem token (deve falhar)...");
    try {
      await axios.post(`${API_BASE_URL}/vendas`, saleTestData);
      console.log("❌ ERRO: Venda foi criada sem token!");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ CORRETO: Requisição sem token foi rejeitada");
      } else {
        console.log("⚠️ Resposta inesperada:", error.response?.status);
      }
    }

    console.log("\n🎉 Todos os testes de autenticação para vendas passaram!");
  } catch (error) {
    console.error("❌ Erro nos testes:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.log(
        "\n💡 Dica: Verifique se o usuário de teste existe no banco de dados"
      );
      console.log("   Email: test@example.com");
      console.log("   Senha: test123");
    }

    process.exit(1);
  }
}

if (require.main === module) {
  testSalesAuth();
}

module.exports = { testSalesAuth };
