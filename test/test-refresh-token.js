const axios = require("axios");

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";
const TEST_EMAIL = "admin@test.com";
const TEST_PASSWORD = "admin123";

async function testRefreshToken() {
  console.log("🧪 Testando sistema de Refresh Token...\n");

  try {
    console.log("1️⃣ Fazendo login...");
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    const { accessToken, refreshToken } = loginResponse.data;
    console.log("✅ Login realizado com sucesso");
    console.log(`📝 Access Token: ${accessToken.substring(0, 20)}...`);
    console.log(`🔄 Refresh Token: ${refreshToken.substring(0, 20)}...\n`);

    console.log("2️⃣ Testando refresh token válido...");
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken: refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      refreshResponse.data;
    console.log("✅ Refresh token válido processado com sucesso");
    console.log(`📝 Novo Access Token: ${newAccessToken.substring(0, 20)}...`);
    console.log(
      `🔄 Novo Refresh Token: ${newRefreshToken.substring(0, 20)}...\n`
    );

    console.log("3️⃣ Testando refresh token inválido...");
    try {
      await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refreshToken: "invalid_token_here",
      });
      console.log("❌ Erro: Deveria ter rejeitado token inválido");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("✅ Token inválido rejeitado corretamente");
      } else {
        console.log(
          "❌ Erro inesperado:",
          error.response?.data || error.message
        );
      }
    }

    console.log("\n4️⃣ Testando refresh token vazio...");
    try {
      await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refreshToken: "",
      });
      console.log("❌ Erro: Deveria ter rejeitado token vazio");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("✅ Token vazio rejeitado corretamente");
      } else {
        console.log(
          "❌ Erro inesperado:",
          error.response?.data || error.message
        );
      }
    }

    console.log("\n5️⃣ Testando logout...");
    const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`, {
      refreshToken: newRefreshToken,
    });
    console.log("✅ Logout realizado com sucesso");

    console.log("\n6️⃣ Testando refresh token após logout...");
    try {
      await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refreshToken: newRefreshToken,
      });
      console.log("❌ Erro: Deveria ter rejeitado token após logout");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("✅ Token após logout rejeitado corretamente");
      } else {
        console.log(
          "❌ Erro inesperado:",
          error.response?.data || error.message
        );
      }
    }

    console.log("\n🎉 Todos os testes de refresh token passaram!");
  } catch (error) {
    console.error("❌ Erro no teste:", error.response?.data || error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testRefreshToken();
}

module.exports = { testRefreshToken };
