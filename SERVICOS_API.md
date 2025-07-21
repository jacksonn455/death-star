# API de Serviços - Death Star

Esta documentação descreve as APIs para gerenciamento de serviços no sistema Death Star.

## Base URL
```
https://death-star.onrender.com/vendas
```

## Autenticação
Todas as rotas requerem autenticação via token JWT no header:
```
Authorization: Bearer <token>
```

## Endpoints de Serviços

### 1. Criar Serviço
**POST** `/services`

Cria um novo serviço.

**Body:**
```json
{
  "name": "Limpeza de pele",
  "category": "facial",
  "duration": "1h 30 min",
  "price": 220.00,
  "description": "Limpeza profunda da pele"
}
```

**Resposta:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "Limpeza de pele",
  "category": "facial",
  "duration": "1h 30 min",
  "price": 220.00,
  "description": "Limpeza profunda da pele",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Listar Todos os Serviços
**GET** `/services`

Lista todos os serviços com filtros opcionais.

**Query Parameters:**
- `category` (opcional): facial, corporal, pos_operatorio
- `isActive` (opcional): true/false

**Exemplo:**
```
GET /services?category=facial&isActive=true
```

**Resposta:**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Limpeza de pele",
    "category": "facial",
    "duration": "1h 30 min",
    "price": 220.00,
    "isActive": true
  }
]
```

### 3. Buscar Serviço por ID
**GET** `/services/:id`

Busca um serviço específico por ID.

**Resposta:**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "Limpeza de pele",
  "category": "facial",
  "duration": "1h 30 min",
  "price": 220.00,
  "isActive": true
}
```

### 4. Atualizar Serviço
**PUT** `/services/:id`

Atualiza um serviço existente.

**Body:**
```json
{
  "price": 250.00,
  "description": "Limpeza profunda da pele com hidratação"
}
```

### 5. Deletar Serviço
**DELETE** `/services/:id`

Remove um serviço do sistema.

### 6. Buscar Serviços por Categoria
**GET** `/services/category/:category`

Lista serviços de uma categoria específica.

**Categorias válidas:**
- `facial`
- `corporal`
- `pos_operatorio`

### 7. Inicializar Serviços
**POST** `/services/initialize`

Inicializa todos os serviços padrão no sistema.

## Categorias de Serviços

### Serviços Faciais
- Anamnese facial – 100 reais, desconto no plano de tratamento (1h - R$ 250,00)
- Limpeza de pele (1h 30 min - R$ 220,00)
- Microagulhamento + retorno (60 min - R$ 590,00)
- Peeling Químico (45 min - R$ 180,00)
- Peeling de diamante (50 min - R$ 180,00)
- Peeling Elétrico (50 min - R$ 180,00)
- Carboxiterapia - olheiras (30 min - R$ 130,00)
- Carboxiterapia - papada (30 min - R$ 130,00)
- Modulação cutânea (50 min - R$ 185,00)
- Radiofrequência Facial + gluconolactona (50 min - R$ 250,00)
- Jato de plasma – blefaro (60 min - R$ 390,00)
- Jato de plasma – Full Face (1h 30 min - R$ 590,00)
- Ultrassom Microfocado Full face (1h 30 min - R$ 990,00)
- Ultrassom Microfocado Terço inferior (40 min - R$ 790,00)
- Ultrassom Microfocado Face + pescoço (2h - R$ 1.190,00)
- Bioestimulador enzimático (1h 30 min - R$ 280,00)

### Serviços Corporais
- Anamnese Corporal – 100 reais, desconto no plano de tratamento (1h - R$ 250,00)
- Carboxiterapia gordura (30 min - R$ 180,00)
- Carboxiterapia celulite (30 min - R$ 180,00)
- Radiofrequência Abdominal (45 min - R$ 180,00)
- Radiofrequência pernas (50 min - R$ 180,00)
- Ultrassom Abdominal (40 min - R$ 180,00)
- Ultrassom Pernas (60 min - R$ 180,00)
- Ultrassom Macrofocado (1h 30 min - R$ 590,00)
- Lipocavitação abdominal (30 min - R$ 180,00)
- Eletrolipólise (60 min - R$ 180,00)
- Ondas de choque nas pernas (50 min - R$ 180,00)
- Corrente russa corporal (30 min - R$ 150,00)
- Bota pneumática (45 min - R$ 180,00)
- Endermologia pernas (50 min - R$ 180,00)
- Criolipólise Big Placê (60 min - R$ 1.290,00)
- Criolipólise pequenas placas (60 min - R$ 890,00)
- PEIM (60 min - R$ 180,00)
- Drenagem linfática manual (60 min - R$ 180,00)
- Drenagem linfática gestante (60 min - R$ 200,00)

### Serviços Pós-operatório
- Drenagem manual pós operatória (60 min - R$ 250,00)
- Tapping abdominal – aplicação hospitalar/ domicilio (60 min - R$ 650,00)
- Tapping peito – aplicação hospitalar/ domicilio (60 min - R$ 490,00)
- Tapping abdominal + peito – aplicação hospitalar/ domicilio (1h e 30 min - R$ 990,00)
- Ultrassom Abdominal (45 min - R$ 180,00)
- Ultrassom Pernas (60 min - R$ 180,00)
- Ondas de choque nas pernas (60 min - R$ 180,00)
- Ondas de choque no abdômen (45 min - R$ 180,00)
- Corrente russa corporal (60 min - R$ 180,00)
- Bota pneumática (45 min - R$ 180,00)
- Curativos conforme necessidade (-- - R$ 150,00) - Variação de 80 à 220
- Banho acompanhado sem lavagem de cabelo (40 min - R$ 120,00)
- Serviço de alta hospitalar: Drenagem manual + laser Ilib (60 min - R$ 220,00)
- Laser Ilib (30 min - R$ 180,00)
- Aplicação de laser e LED cicatrizes (40 min - R$ 180,00)

## Integração com Vendas

Os serviços podem ser incluídos em vendas junto com produtos. Para criar uma venda com serviços:

**POST** `/vendas`

**Body:**
```json
{
  "items": [
    {
      "itemId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "itemType": "service",
      "itemName": "Limpeza de pele",
      "quantity": 1,
      "unitPrice": 220.00,
      "category": "facial",
      "duration": "1h 30 min"
    },
    {
      "itemId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "itemType": "product",
      "itemName": "Creme Hidratante",
      "quantity": 2,
      "unitPrice": 50.00
    }
  ],
  "paymentMethod": "pix",
  "customerName": "João Silva",
  "customerEmail": "joao@email.com",
  "customerPhone": "(11) 99999-9999"
}
```

## Códigos de Erro

- `400`: Dados inválidos
- `401`: Não autenticado
- `404`: Serviço não encontrado
- `500`: Erro interno do servidor

## Observações

1. **Estoque**: Serviços não possuem controle de estoque como produtos
2. **Cancelamento**: Quando uma venda com serviços é cancelada, apenas produtos são devolvidos ao estoque
3. **Ativo/Inativo**: Serviços podem ser marcados como inativos sem serem deletados
4. **Categorias**: Serviços são organizados em 3 categorias principais
5. **Preços**: Todos os preços são em Reais (R$) 