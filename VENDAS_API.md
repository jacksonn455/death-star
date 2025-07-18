# API de Vendas - Documentação

## Visão Geral

O módulo de vendas permite gerenciar vendas de produtos, controlar estoque automaticamente e gerar relatórios mensais. Cada venda baixa automaticamente o estoque dos produtos vendidos.

## Endpoints

### 1. Criar Venda
**POST** `/vendas`

Cria uma nova venda e baixa automaticamente o estoque.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "items": [
    {
      "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "productName": "Paracetamol 500mg",
      "quantity": 2,
      "unitPrice": 5.50
    },
    {
      "productId": "64f1a2b3c4d5e6f7g8h9i0j2",
      "productName": "Ibuprofeno 600mg",
      "quantity": 1,
      "unitPrice": 8.00
    }
  ],
  "customerName": "João Silva",
  "customerEmail": "joao@email.com",
  "customerPhone": "(11) 99999-9999",
  "paymentMethod": "dinheiro",
  "notes": "Cliente preferiu pagamento em dinheiro"
}
```

**Métodos de Pagamento:**
- `dinheiro`
- `cartao_credito`
- `cartao_debito`
- `pix`
- `transferencia`

**Response (201):**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "items": [
    {
      "productId": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "Paracetamol 500mg",
        "quantity": 98,
        "price": 5.50
      },
      "productName": "Paracetamol 500mg",
      "quantity": 2,
      "unitPrice": 5.50,
      "totalPrice": 11.00
    }
  ],
  "totalAmount": 19.00,
  "customerName": "João Silva",
  "customerEmail": "joao@email.com",
  "customerPhone": "(11) 99999-9999",
  "paymentMethod": "dinheiro",
  "status": "concluida",
  "notes": "Cliente preferiu pagamento em dinheiro",
  "soldBy": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "name": "Maria Santos",
    "email": "maria@email.com"
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Listar Vendas
**GET** `/vendas`

Lista todas as vendas com filtros opcionais.

**Query Parameters:**
- `status`: Filtrar por status (concluida, cancelada, pendente)
- `paymentMethod`: Filtrar por método de pagamento
- `startDate`: Data inicial (YYYY-MM-DD)
- `endDate`: Data final (YYYY-MM-DD)
- `soldBy`: ID do usuário que fez a venda

**Exemplo:**
```
GET /vendas?status=concluida&paymentMethod=dinheiro&startDate=2024-01-01&endDate=2024-01-31
```

**Response (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "items": [...],
    "totalAmount": 19.00,
    "customerName": "João Silva",
    "paymentMethod": "dinheiro",
    "status": "concluida",
    "soldBy": {...},
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 3. Buscar Venda por ID
**GET** `/vendas/:id`

Busca uma venda específica por ID.

**Response (200):**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "items": [...],
  "totalAmount": 19.00,
  "customerName": "João Silva",
  "paymentMethod": "dinheiro",
  "status": "concluida",
  "soldBy": {...},
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Atualizar Venda
**PUT** `/vendas/:id`

Atualiza uma venda existente. Se o status for alterado para "cancelada", o estoque será restaurado automaticamente.

**Body:**
```json
{
  "status": "cancelada",
  "notes": "Cliente cancelou a compra"
}
```

### 5. Excluir Venda
**DELETE** `/vendas/:id`

Exclui uma venda. Se a venda não estiver cancelada, o estoque será restaurado automaticamente.

### 6. Resumo de Vendas
**GET** `/vendas/summary`

Retorna um resumo das vendas do dia, mês e ano.

**Response (200):**
```json
{
  "today": {
    "sales": 15,
    "revenue": 1250.50
  },
  "month": {
    "sales": 450,
    "revenue": 38500.75
  },
  "year": {
    "sales": 5400,
    "revenue": 462000.00
  }
}
```

### 7. Relatório Mensal
**GET** `/vendas/report?year=2024&month=1`

Gera um relatório detalhado do mês especificado.

**Response (200):**
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
      "revenue": 1650.00
    },
    "Ibuprofeno 600mg": {
      "quantity": 250,
      "revenue": 2000.00
    }
  },
  "dailySales": {
    "2024-01-15": {
      "sales": 15,
      "revenue": 1250.50
    },
    "2024-01-16": {
      "sales": 18,
      "revenue": 1450.75
    }
  }
}
```

## Controle de Estoque

- **Venda Criada**: O estoque é automaticamente reduzido
- **Venda Cancelada**: O estoque é automaticamente restaurado
- **Venda Excluída**: O estoque é automaticamente restaurado (se não estiver cancelada)

## Validações

- Quantidade deve ser maior que zero
- Preço unitário deve ser maior que zero
- Produto deve existir no banco
- Estoque deve ser suficiente
- Método de pagamento deve ser válido
- Pelo menos um item deve ser incluído

## Status da Venda

- `concluida`: Venda finalizada (padrão)
- `cancelada`: Venda cancelada (restaura estoque)
- `pendente`: Venda pendente

## Exemplos de Uso

### Criar uma venda simples:
```bash
curl -X POST http://localhost:8000/vendas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
        "productName": "Paracetamol 500mg",
        "quantity": 2,
        "unitPrice": 5.50
      }
    ],
    "paymentMethod": "dinheiro",
    "customerName": "João Silva"
  }'
```

### Buscar vendas do mês:
```bash
curl -X GET "http://localhost:8000/vendas?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <token>"
```

### Gerar relatório mensal:
```bash
curl -X GET "http://localhost:8000/vendas/report?year=2024&month=1" \
  -H "Authorization: Bearer <token>"
``` 