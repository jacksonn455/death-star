# Módulo de Vendas - Death Star API

## 🎯 Visão Geral

O módulo de vendas foi criado para gerenciar vendas de produtos com controle automático de estoque e geração de relatórios mensais. Cada venda baixa automaticamente o estoque dos produtos vendidos.

## 🚀 Funcionalidades

### ✅ Implementadas

- ✅ Criar vendas com múltiplos produtos
- ✅ Controle automático de estoque
- ✅ Validação de estoque disponível
- ✅ Restauração de estoque ao cancelar vendas
- ✅ Relatórios mensais detalhados
- ✅ Resumo de vendas (dia/mês/ano)
- ✅ Filtros por status, método de pagamento, data
- ✅ Validações completas de dados
- ✅ Integração com sistema de autenticação

## 📁 Estrutura do Módulo

```
models/
├── sales.js              # Modelo de dados das vendas

services/
├── sales.js              # Lógica de negócio das vendas

controllers/
├── sales.js              # Controladores das rotas

routes/
├── sales.js              # Definição das rotas da API

test/
├── test-sales.js         # Testes da API de vendas

docs/
├── VENDAS_API.md         # Documentação completa da API
```

## 🔧 Instalação e Configuração

O módulo já está integrado ao projeto principal. Para usar:

1. **Certifique-se de que o servidor está rodando:**

   ```bash
   npm start
   ```

2. **Acesse as rotas de vendas:**
   ```
   http://localhost:8000/vendas
   ```

## 📋 Endpoints Disponíveis

| Método | Endpoint          | Descrição                 |
| ------ | ----------------- | ------------------------- |
| POST   | `/vendas`         | Criar nova venda          |
| GET    | `/vendas`         | Listar vendas com filtros |
| GET    | `/vendas/:id`     | Buscar venda por ID       |
| PUT    | `/vendas/:id`     | Atualizar venda           |
| DELETE | `/vendas/:id`     | Excluir venda             |
| GET    | `/vendas/summary` | Resumo de vendas          |
| GET    | `/vendas/report`  | Relatório mensal          |

## 🛒 Como Criar uma Venda

### Exemplo de Venda Simples:

```javascript
const saleData = {
  items: [
    {
      productId: "64f1a2b3c4d5e6f7g8h9i0j1",
      productName: "Paracetamol 500mg",
      quantity: 2,
      unitPrice: 5.5,
    },
  ],
  customerName: "João Silva",
  paymentMethod: "dinheiro",
};

const response = await fetch("/vendas", {
  method: "POST",
  headers: {
    Authorization: "Bearer seu_token",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(saleData),
});
```

### Métodos de Pagamento Disponíveis:

- `dinheiro`
- `cartao_credito`
- `cartao_debito`
- `pix`
- `transferencia`

## 📊 Relatórios

### Resumo de Vendas

```javascript
const summary = await fetch("/vendas/summary", {
  headers: { Authorization: "Bearer seu_token" },
});
```

**Resposta:**

```json
{
  "today": {
    "sales": 15,
    "revenue": 1250.5
  },
  "month": {
    "sales": 450,
    "revenue": 38500.75
  },
  "year": {
    "sales": 5400,
    "revenue": 462000.0
  }
}
```

### Relatório Mensal

```javascript
const report = await fetch("/vendas/report?year=2024&month=1", {
  headers: { Authorization: "Bearer seu_token" },
});
```

**Resposta:**

```json
{
  "period": "2024-01",
  "totalSales": 450,
  "totalRevenue": 38500.75,
  "totalItems": 1800,
  "paymentMethods": {
    "dinheiro": 150,
    "cartao_credito": 200,
    "pix": 100
  },
  "topProducts": {
    "Paracetamol 500mg": {
      "quantity": 300,
      "revenue": 1650.0
    }
  },
  "dailySales": {
    "2024-01-15": {
      "sales": 15,
      "revenue": 1250.5
    }
  }
}
```

## 🔍 Filtros Disponíveis

### Listar Vendas com Filtros:

```javascript
endDate = 2024 - 01 - 31;
const filteredSales = await fetch(
  "/vendas?status=concluida&paymentMethod=dinheiro",
  {
    headers: { Authorization: "Bearer seu_token" },
  }
);
```

**Parâmetros de Filtro:**

- `status`: concluida, cancelada, pendente
- `paymentMethod`: método de pagamento
- `startDate`: data inicial (YYYY-MM-DD)
- `endDate`: data final (YYYY-MM-DD)
- `soldBy`: ID do usuário que fez a venda

## 🧪 Testes

Para testar o módulo de vendas:

1. **Configure o token de autenticação:**

   ```javascript
   const TOKEN = "seu_token_aqui";
   ```

2. **Execute os testes:**
   ```bash
   node test/test-sales.js
   ```

## 🔄 Controle de Estoque

O módulo gerencia automaticamente o estoque:

- **Venda Criada**: Estoque é reduzido automaticamente
- **Venda Cancelada**: Estoque é restaurado automaticamente
- **Venda Excluída**: Estoque é restaurado (se não estiver cancelada)

## ✅ Validações

O sistema valida automaticamente:

- ✅ Quantidade deve ser maior que zero
- ✅ Preço unitário deve ser maior que zero
- ✅ Produto deve existir no banco
- ✅ Estoque deve ser suficiente
- ✅ Método de pagamento deve ser válido
- ✅ Pelo menos um item deve ser incluído

## 🚨 Tratamento de Erros

### Erro de Estoque Insuficiente:

```json
{
  "error": "Estoque insuficiente para Paracetamol 500mg. Disponível: 5"
}
```

### Erro de Produto Não Encontrado:

```json
{
  "error": "Produto com ID 64f1a2b3c4d5e6f7g8h9i0j1 não encontrado."
}
```

### Erro de Dados Inválidos:

```json
{
  "error": "A venda deve conter pelo menos um item."
}
```

## 📈 Status da Venda

- `concluida`: Venda finalizada (padrão)
- `cancelada`: Venda cancelada (restaura estoque)
- `pendente`: Venda pendente

## 🔐 Autenticação

Todas as rotas de vendas requerem autenticação:

```javascript
headers: {
  'Authorization': 'Bearer seu_jwt_token'
}
```

## 📝 Exemplo Completo de Uso

```javascript
const createSale = async () => {
  const saleData = {
    items: [
      {
        productId: "64f1a2b3c4d5e6f7g8h9i0j1",
        productName: "Paracetamol 500mg",
        quantity: 2,
        unitPrice: 5.5,
      },
    ],
    customerName: "João Silva",
    paymentMethod: "dinheiro",
  };

  const response = await fetch("/vendas", {
    method: "POST",
    headers: {
      Authorization: "Bearer seu_token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(saleData),
  });

  return response.json();
};

const getSalesSummary = async () => {
  const response = await fetch("/vendas/summary", {
    headers: { Authorization: "Bearer seu_token" },
  });
  return response.json();
};

const getMonthlyReport = async (year, month) => {
  const response = await fetch(`/vendas/report?year=${year}&month=${month}`, {
    headers: { Authorization: "Bearer seu_token" },
  });
  return response.json();
};
```

## 🎉 Próximos Passos

O módulo de vendas está completo e funcional! Você pode:

1. **Testar a API** usando o arquivo `test/test-sales.js`
2. **Integrar com o frontend** usando os endpoints documentados
3. **Personalizar relatórios** modificando o serviço de relatórios
4. **Adicionar novos filtros** conforme necessário

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação completa em `VENDAS_API.md`
2. Execute os testes para verificar se tudo está funcionando
3. Verifique os logs do servidor para identificar erros

---

**🎯 Módulo de Vendas - Pronto para Uso! 🚀**
