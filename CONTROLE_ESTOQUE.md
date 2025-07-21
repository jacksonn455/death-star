# Controle de Estoque - Death Star

## Como Funciona

O sistema de controle de estoque está implementado para garantir que:

1. **Produtos** tenham seu estoque reduzido quando vendidos
2. **Serviços** não afetem o estoque (não possuem estoque)
3. **Cancelamentos** devolvam produtos ao estoque
4. **Validações** impeçam vendas com estoque insuficiente

## Implementação no Código

### 1. Criação de Venda (`createSaleService`)

```javascript
// Para cada item na venda
for (const item of saleData.items) {
  if (item.itemType === "product") {
    // Busca o produto
    const product = await Product.findById(item.itemId);
    
    // Valida se existe
    if (!product) {
      throw new Error(`Produto com ID ${item.itemId} não encontrado.`);
    }

    // Valida se tem estoque suficiente
    if (product.quantity < item.quantity) {
      throw new Error(`Estoque insuficiente para ${product.name}. Disponível: ${product.quantity}`);
    }

    // Reduz o estoque
    await Product.findByIdAndUpdate(item.itemId, {
      $inc: { quantity: -item.quantity }
    });
  } else if (item.itemType === "service") {
    // Para serviços, apenas valida se existe e está ativo
    const service = await Service.findById(item.itemId);
    
    if (!service) {
      throw new Error(`Serviço com ID ${item.itemId} não encontrado.`);
    }

    if (!service.isActive) {
      throw new Error(`Serviço ${service.name} não está ativo.`);
    }
  }
}
```

### 2. Cancelamento de Venda (`updateSaleService`)

```javascript
// Quando uma venda é cancelada
if (updatedData.status === "cancelada" && existingSale.status !== "cancelada") {
  for (const item of existingSale.items) {
    if (item.itemType === "product") {
      // Devolve produtos ao estoque
      await Product.findByIdAndUpdate(item.itemId, {
        $inc: { quantity: item.quantity }
      });
    }
    // Para serviços não há necessidade de devolver ao estoque
  }
}
```

### 3. Deleção de Venda (`deleteSaleService`)

```javascript
// Quando uma venda é deletada
if (sale.status !== "cancelada") {
  for (const item of sale.items) {
    if (item.itemType === "product") {
      // Devolve produtos ao estoque
      await Product.findByIdAndUpdate(item.itemId, {
        $inc: { quantity: item.quantity }
      });
    }
    // Para serviços não há necessidade de devolver ao estoque
  }
}
```

## Fluxo Completo

### Cenário 1: Venda Normal de Produto

1. **Produto**: Creme Hidratante (Estoque: 10)
2. **Venda**: 3 unidades
3. **Resultado**: Estoque = 7

### Cenário 2: Venda com Produto e Serviço

1. **Produto**: Creme Hidratante (Estoque: 10)
2. **Serviço**: Limpeza de pele (sem estoque)
3. **Venda**: 1 produto + 1 serviço
4. **Resultado**: Estoque do produto = 9, Serviço sem alteração

### Cenário 3: Cancelamento de Venda

1. **Venda**: 2 produtos (estoque reduzido para 8)
2. **Cancelamento**: Status alterado para "cancelada"
3. **Resultado**: Estoque volta para 10

### Cenário 4: Tentativa de Venda com Estoque Insuficiente

1. **Produto**: Creme Hidratante (Estoque: 2)
2. **Tentativa**: Vender 5 unidades
3. **Resultado**: Erro - "Estoque insuficiente"

## Validações Implementadas

### ✅ Validações de Produto
- Produto existe no banco
- Estoque suficiente disponível
- Quantidade positiva
- Preço válido

### ✅ Validações de Serviço
- Serviço existe no banco
- Serviço está ativo
- Preço válido

### ✅ Validações de Venda
- Pelo menos um item
- Método de pagamento válido
- Usuário autenticado

## Testes Automatizados

Execute o script de teste para verificar o funcionamento:

```bash
node test/test-estoque.js
```

### Testes Incluídos

1. **Venda de Produto**
   - Verifica se estoque é reduzido
   - Valida quantidade correta

2. **Venda com Estoque Insuficiente**
   - Verifica se venda é rejeitada
   - Valida mensagem de erro

3. **Cancelamento de Venda**
   - Verifica se estoque é devolvido
   - Valida quantidade original

4. **Deleção de Venda**
   - Verifica se estoque é devolvido
   - Valida quantidade original

5. **Venda Mista (Produto + Serviço)**
   - Verifica se apenas produto afeta estoque
   - Valida serviço não altera estoque

## Exemplos de Uso

### Criar Venda com Produto

```json
{
  "items": [
    {
      "itemId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "itemType": "product",
      "itemName": "Creme Hidratante",
      "quantity": 2,
      "unitPrice": 50.00
    }
  ],
  "paymentMethod": "pix",
  "customerName": "João Silva"
}
```

### Criar Venda Mista

```json
{
  "items": [
    {
      "itemId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "itemType": "product",
      "itemName": "Creme Hidratante",
      "quantity": 1,
      "unitPrice": 50.00
    },
    {
      "itemId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "itemType": "service",
      "itemName": "Limpeza de pele",
      "quantity": 1,
      "unitPrice": 220.00,
      "category": "facial",
      "duration": "1h 30 min"
    }
  ],
  "paymentMethod": "pix",
  "customerName": "João Silva"
}
```

### Cancelar Venda

```json
PUT /vendas/:id
{
  "status": "cancelada"
}
```

## Observações Importantes

1. **Transações**: O sistema não usa transações do MongoDB, mas valida estoque antes de criar a venda
2. **Concorrência**: Em caso de alta concorrência, pode haver pequenas inconsistências
3. **Serviços**: Não possuem controle de estoque, apenas validação de existência e status
4. **Logs**: Todas as operações são logadas para auditoria
5. **Relatórios**: Incluem tanto produtos quanto serviços

## Monitoramento

Para monitorar o estoque:

1. **Relatórios Mensais**: Incluem produtos mais vendidos
2. **Alertas**: Produtos com estoque baixo
3. **Histórico**: Todas as vendas são registradas com detalhes
4. **Auditoria**: Logs de todas as operações de estoque

## Status

✅ **Implementado e Funcionando**
- Controle automático de estoque
- Validações completas
- Devolução em cancelamentos
- Testes automatizados
- Documentação completa 