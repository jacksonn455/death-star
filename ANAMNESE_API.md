# API de Anamnese - Documentação

## Visão Geral

A API de Anamnese permite gerenciar dados completos de anamnese facial para pacientes, incluindo informações pessoais, histórico médico, hábitos, condições da pele, tratamentos e assinaturas.

## Endpoints

### 1. Buscar Anamnese

```
GET /api/pacientes/:id/anamnese
```

**Descrição:** Busca a anamnese completa de um paciente específico.

**Parâmetros:**

- `id` (path): ID do paciente (MongoDB ObjectId)

**Resposta de Sucesso (200):**

```json
{
  "nome": "Maria Silva",
  "idade": 35,
  "profissao": "Advogada",
  "dataNascimento": "1988-05-15T00:00:00.000Z",
  "cpf": "123.456.789-00",
  "rg": "12.345.678-9",
  "contato": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123 - São Paulo/SP",
  "escolaridade": "Superior Completo",
  "estadoCivil": "Casada",
  "image": "https://res.cloudinary.com/...",
  "queixa": "Manchas escuras no rosto e linhas de expressão",
  "soubeDoTrabalho": "Indicação de amiga",
  "inicioQueixa": "Há 2 anos",
  "intensificacaoQueixa": "Após exposição solar excessiva",
  "tratamentosAnteriores": "Já fez peeling químico e uso de cremes",
  "usoProdutos": "Protetor solar, hidratante e vitamina C",
  "patologias": ["Diabetes Tipo 2", "Hipertensão"],
  "funcionamentoIntestinal": "Todos os dias",
  "gestante": "Não",
  "contraceptivo": "Pílula",
  "cicloMenstrual": "28 dias",
  "ultimaGestacao": "5 anos atrás",
  "qualidadeSono": "8H",
  "ansiedade": "Moderado",
  "nervosismo": "Moderado",
  "exercicio": "3X na semana",
  "tabagista": "nao",
  "alcool": "3x na semana",
  "covid": "Sim",
  "sequelas": "Perda de olfato por 3 meses",
  "alergias": "Nenhuma conhecida",
  "suplementacao": "Sim",
  "suplementacaoDescricao": "Vitamina D e Ômega 3",
  "refeicoes": "5x ao dia",
  "carne": "3x na semana",
  "lanches": "1x na semana",
  "refrigerante": "Não ingere",
  "frutas": "Todos os dias",
  "leite": "Todos os dias",
  "madrugada": "Não",
  "ultimoHorario": "20:00",
  "horarioDorme": "23:00",
  "intolerancia": "Nenhuma",
  "melasma": "Misto",
  "manchas": ["Solares", "Hormonais"],
  "linhas": ["Testa", "Ao redor dos olhos"],
  "acne": "Não apresenta",
  "grau": "",
  "regiaoAcne": [],
  "cicatriz": "Não apresenta",
  "tipoCicatriz": [],
  "olheiras": "Apresenta",
  "tipoOlheiras": ["Estrutural", "Vascular"],
  "tratamento": {
    "diagnostico": "Melasma misto e linhas de expressão",
    "descricao": "Tratamento com peeling e preenchimento",
    "conduta": "6 sessões de peeling + 2 sessões de preenchimento",
    "valor": "R$ 2.500,00",
    "data": "2024-01-15",
    "assinatura": "data:image/png;base64,...",
    "termosAceitos": {
      "termo1": true,
      "termo2": true
    }
  },
  "tratamentoSugerido": {
    "tratamento": "Peeling + Preenchimento",
    "numeroSessao": 8,
    "valorSessao": 312.5,
    "valorTotal": 2500.0,
    "preAgendamento": "15/01/2024",
    "horario": "14:00"
  },
  "contratoAssinaturas": [
    {
      "contratanteAssinatura": "data:image/png;base64,...",
      "contratadaAssinatura": "data:image/png;base64,...",
      "data": "2024-01-15T00:00:00.000Z"
    }
  ],
  "contractSignatures": {
    "clientSignature": "data:image/png;base64,...",
    "providerSignature": "data:image/png;base64,..."
  }
}
```

### 2. Criar Anamnese

```
POST /api/pacientes/:id/anamnese
```

**Descrição:** Cria ou atualiza a anamnese completa de um paciente.

**Parâmetros:**

- `id` (path): ID do paciente (MongoDB ObjectId)
- `body`: Dados completos da anamnese (mesma estrutura da resposta acima)

**Resposta de Sucesso (201):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nome": "Maria Silva"
}
```

### 3. Atualizar Anamnese

```
PUT /api/pacientes/:id/anamnese
```

**Descrição:** Atualiza a anamnese existente de um paciente.

**Parâmetros:**

- `id` (path): ID do paciente (MongoDB ObjectId)
- `body`: Dados atualizados da anamnese

**Resposta de Sucesso (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nome": "Maria Silva"
}
```

## Estrutura dos Dados

### Informações Pessoais

- `nome` (String, obrigatório): Nome completo do paciente
- `idade` (Number, obrigatório): Idade do paciente
- `profissao` (String): Profissão do paciente
- `dataNascimento` (Date, obrigatório): Data de nascimento
- `cpf` (String): CPF do paciente
- `rg` (String): RG do paciente
- `contato` (String): Número de contato
- `endereco` (String): Endereço completo
- `escolaridade` (String): Nível de escolaridade
- `estadoCivil` (String): Estado civil
- `image` (String): URL da foto do paciente

### Primeira Consulta

- `queixa` (String): Queixa principal do paciente
- `soubeDoTrabalho` (String): Como soube do trabalho

### Histórico da Queixa

- `inicioQueixa` (String): Quando começou a queixa
- `intensificacaoQueixa` (String): Quando se intensificou
- `tratamentosAnteriores` (String): Tratamentos realizados anteriormente
- `usoProdutos` (String): Produtos utilizados

### Histórico de Patologias

- `patologias` (Array[String]): Lista de patologias

### Conhecendo Mais Sobre Você

- `funcionamentoIntestinal` (String): Funcionamento intestinal
- `gestante` (String): Se é gestante
- `contraceptivo` (String): Método contraceptivo
- `cicloMenstrual` (String): Ciclo menstrual
- `ultimaGestacao` (String): Última gestação
- `qualidadeSono` (String): Qualidade do sono
- `ansiedade` (String): Nível de ansiedade
- `nervosismo` (String): Nível de nervosismo
- `exercicio` (String): Frequência de exercícios

### Hábitos e Alimentação

- `tabagista` (String): Se é tabagista
- `alcool` (String): Consumo de álcool
- `covid` (String): Histórico de COVID-19
- `sequelas` (String): Sequelas de COVID-19
- `alergias` (String): Alergias conhecidas
- `suplementacao` (String): Se faz suplementação
- `suplementacaoDescricao` (String): Descrição da suplementação
- `refeicoes` (String): Frequência de refeições
- `carne` (String): Consumo de carne
- `lanches` (String): Consumo de lanches
- `refrigerante` (String): Consumo de refrigerante
- `frutas` (String): Consumo de frutas
- `leite` (String): Consumo de leite
- `madrugada` (String): Se come de madrugada
- `ultimoHorario` (String): Último horário de alimentação
- `horarioDorme` (String): Horário que dorme
- `intolerancia` (String): Intolerâncias alimentares

### Condições da Pele

- `melasma` (String): Tipo de melasma
- `manchas` (Array[String]): Tipos de manchas
- `linhas` (Array[String]): Localização das linhas de expressão
- `acne` (String): Se apresenta acne
- `grau` (String): Grau da acne
- `regiaoAcne` (Array[String]): Regiões com acne
- `cicatriz` (String): Se apresenta cicatrizes
- `tipoCicatriz` (Array[String]): Tipos de cicatrizes
- `olheiras` (String): Se apresenta olheiras
- `tipoOlheiras` (Array[String]): Tipos de olheiras

### Tratamento

- `tratamento.diagnostico` (String): Diagnóstico
- `tratamento.descricao` (String): Descrição do tratamento
- `tratamento.conduta` (String): Conduta do tratamento
- `tratamento.valor` (String): Valor do tratamento
- `tratamento.data` (String): Data do tratamento
- `tratamento.assinatura` (String): Assinatura (base64)
- `tratamento.termosAceitos.termo1` (Boolean): Aceite do termo 1
- `tratamento.termosAceitos.termo2` (Boolean): Aceite do termo 2

### Tratamento Sugerido

- `tratamentoSugerido.tratamento` (String): Nome do tratamento
- `tratamentoSugerido.numeroSessao` (Number): Número de sessões
- `tratamentoSugerido.valorSessao` (Number): Valor por sessão
- `tratamentoSugerido.valorTotal` (Number): Valor total
- `tratamentoSugerido.preAgendamento` (String): Data do pré-agendamento
- `tratamentoSugerido.horario` (String): Horário do agendamento

### Contrato e Assinaturas

- `contratoAssinaturas` (Array): Array de assinaturas do contrato
- `contractSignatures.clientSignature` (String): Assinatura do cliente
- `contractSignatures.providerSignature` (String): Assinatura do profissional

## Códigos de Erro

- `400`: Dados inválidos ou ID malformado
- `404`: Paciente não encontrado
- `500`: Erro interno do servidor

## Exemplo de Uso

### Criar Anamnese Completa

```javascript
const axios = require("axios");

const anamneseData = {
  nome: "Maria Silva",
  idade: 35,
  profissao: "Advogada",
  dataNascimento: "1988-05-15",
  queixa: "Manchas escuras no rosto",
};

const response = await axios.post(
  "http://localhost:3001/api/pacientes/507f1f77bcf86cd799439011/anamnese",
  anamneseData
);

console.log("Anamnese criada:", response.data);
```

### Buscar Anamnese

```javascript
const response = await axios.get(
  "http://localhost:3001/api/pacientes/507f1f77bcf86cd799439011/anamnese"
);

console.log("Anamnese:", response.data);
```

## Testes

Para executar os testes da API de anamnese:

```bash
npm run test:anamnese
```

Este comando irá:

1. Criar um paciente básico
2. Criar uma anamnese completa
3. Buscar e validar a anamnese
4. Atualizar a anamnese
5. Verificar as atualizações
6. Buscar o paciente completo

## Notas Importantes

1. **Imagens**: As assinaturas são armazenadas como base64 strings
2. **Arrays**: Campos como `patologias`, `manchas`, `linhas` são arrays de strings
3. **Datas**: Use formato ISO para datas (YYYY-MM-DD)
4. **Valores**: Valores monetários podem ser strings ou números
5. **Campos Opcionais**: Apenas `nome`, `idade` e `dataNascimento` são obrigatórios
6. **Atualizações**: O middleware atualiza automaticamente o campo `updatedAt`
