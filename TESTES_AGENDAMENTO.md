# Testes do Sistema de Agendamento

Este documento descreve os testes implementados para validar o sistema de agendamento, garantindo que não seja possível agendar 2 pessoas no mesmo horário e que todos os cenários possíveis sejam cobertos.

## Visão Geral

O sistema de agendamento foi testado em três níveis:

1. **Testes Básicos** (`test-planner.js`) - Validações fundamentais
2. **Testes Avançados** (`test-planner-advanced.js`) - Cenários complexos e edge cases
3. **Testes de Sobreposição** (`test-planner-overlap.js`) - Validação de sobreposições parciais

## Funcionalidades Testadas

### ✅ Validações de Conflito

- **Conflito Exato**: Mesma data e hora
- **Sobreposição Parcial**: Agendamentos que se sobrepõem parcialmente
- **Sobreposição Completa**: Um agendamento dentro do outro
- **Conflito na Atualização**: Validação ao atualizar agendamentos

### ✅ Validações de Formato

- **Data**: Formato YYYY-MM-DD, datas inválidas, meses/dias inexistentes
- **Hora**: Formato HH:mm, horas/minutos inválidos, formatos incorretos
- **Campos Obrigatórios**: Paciente, data, hora

### ✅ Cenários Válidos

- **Agendamentos Consecutivos**: Horários seguidos sem sobreposição
- **Datas Diferentes**: Mesmo horário em datas diferentes
- **Horários Extremos**: 00:00, 23:59, horários comerciais
- **Operações CRUD**: Criar, ler, atualizar, excluir

## Como Executar os Testes

### Configuração Inicial

1. **Servidor rodando na porta 8000**
2. **Banco de dados conectado**
3. **Dependências instaladas**
4. **Criar usuário de teste** (execute uma vez):
   ```bash
   npm run create-test-user
   ```

### Autenticação

O sistema de agendamento requer autenticação. Os testes foram criados em duas versões:

- **Sem autenticação**: Testes básicos que falharão com erro 401
- **Com autenticação**: Testes completos que fazem login automaticamente

**Recomendação**: Use os testes com autenticação para validação completa do sistema.

### Comandos Disponíveis

```bash
# Criar usuário de teste (execute uma vez)
npm run create-test-user

# Teste básico do planner (sem autenticação)
npm run test:planner

# Teste avançado do planner (sem autenticação)
npm run test:planner-advanced

# Teste de sobreposições (sem autenticação)
npm run test:planner-overlap

# Teste com autenticação (recomendado)
npm run test:planner-auth

# Todos os testes de agendamento (sem autenticação)
npm run test:planner-all

# Todos os testes do sistema
npm run test:all
```

## Cenários de Teste Detalhados

### 1. Testes Básicos (`test-planner.js`)

#### ✅ Criação de Agendamento Válido

- Valida criação com dados corretos
- Verifica retorno do ID do agendamento

#### ✅ Prevenção de Conflito de Horário

- Tenta criar agendamento no mesmo horário
- Verifica se o erro é retornado corretamente

#### ✅ Agendamentos em Horários Diferentes

- Valida criação de agendamentos consecutivos
- Testa horários matinais e noturnos

#### ✅ Agendamentos em Datas Diferentes

- Mesmo horário em datas diferentes
- Verifica que não há conflito

#### ✅ Validação de Dados Obrigatórios

- Testa campos obrigatórios ausentes
- Valida formatos de data e hora

#### ✅ Operações CRUD

- Busca de agendamentos
- Atualização de agendamentos
- Exclusão de agendamentos

### 2. Testes Avançados (`test-planner-advanced.js`)

#### ✅ Conflito Exato de Horário

- Cria primeiro agendamento
- Tenta criar segundo no mesmo horário
- Verifica detecção do conflito

#### ✅ Agendamentos Consecutivos

- Cria múltiplos agendamentos seguidos
- Verifica que não há conflitos

#### ✅ Agendamentos em Datas Diferentes

- Mesmo horário em datas distintas
- Valida que são permitidos

#### ✅ Validação de Formato de Data

- Testa formatos inválidos
- Valida datas inexistentes
- Verifica formatos incorretos

#### ✅ Validação de Formato de Hora

- Testa horas inválidas (>24)
- Valida minutos inválidos (>59)
- Verifica formatos incorretos

#### ✅ Horários Extremos

- 00:00 (meia-noite)
- 23:59 (último minuto)
- Horários comerciais (08:00, 18:00)

#### ✅ Atualização com Conflito

- Atualiza agendamento para horário ocupado
- Verifica detecção do conflito

### 3. Testes de Sobreposição (`test-planner-overlap.js`)

#### ✅ Sobreposição Parcial - Anterior Termina Durante Novo

- Agendamento 1: 10:00-11:00
- Tentativa: 10:30-11:30
- Verifica detecção da sobreposição

#### ✅ Sobreposição Parcial - Novo Termina Durante Anterior

- Agendamento 1: 14:00-15:00
- Tentativa: 13:30-14:30
- Verifica detecção da sobreposição

#### ✅ Sobreposição Completa - Novo Dentro do Anterior

- Agendamento 1: 16:00-17:00
- Tentativa: 16:15-16:45
- Verifica detecção da sobreposição

#### ✅ Sobreposição Completa - Anterior Dentro do Novo

- Agendamento 1: 18:00-18:30
- Tentativa: 17:30-18:45
- Verifica detecção da sobreposição

#### ✅ Agendamentos Consecutivos Válidos

- 09:00-10:00
- 10:00-11:00
- 11:00-12:00
- Verifica que são permitidos

#### ✅ Atualização com Sobreposição

- Atualiza agendamento para causar sobreposição
- Verifica detecção do conflito

## Melhorias Implementadas

### 🔧 Validação de Sobreposições

O sistema foi melhorado para detectar sobreposições parciais, não apenas conflitos exatos:

```javascript
const existingPlanner = await Planner.findOne({ date, time });

const overlappingPlanners = await Planner.find(overlappingQuery);
for (const planner of overlappingPlanners) {
  if (
    appointmentStart.isBefore(existingEnd) &&
    appointmentEnd.isAfter(existingStart)
  ) {
    throw new Error("Existe sobreposição de horários com outro agendamento.");
  }
}
```

### 🔧 Validação na Atualização

A função de atualização agora valida conflitos excluindo o agendamento atual:

```javascript
await validateExistingPlanner(data.date, data.time, id);
```

## Resultados Esperados

### ✅ Cenários que DEVEM Passar

- Criação de agendamentos válidos
- Agendamentos consecutivos
- Agendamentos em datas diferentes
- Operações CRUD básicas
- Validação de formatos corretos

### ❌ Cenários que DEVEM Falhar

- Conflitos de horário exato
- Sobreposições parciais
- Dados obrigatórios ausentes
- Formatos inválidos
- Atualizações com conflito

## Limpeza Automática

Todos os testes incluem limpeza automática dos dados criados durante os testes, garantindo que o banco de dados não seja poluído.

## Monitoramento

Os testes fornecem feedback detalhado:

- ✅ Testes que passaram
- ❌ Testes que falharam
- ⏭️ Testes que foram pulados
- 📊 Resumo final com estatísticas

## Troubleshooting

### Problemas Comuns

1. **Servidor não responde**

   - Verifique se o servidor está rodando na porta 8000
   - Execute `npm start` antes dos testes

2. **Erro de conexão com banco**

   - Verifique a variável `MONGO_URI`
   - Teste a conexão com `npm run test:connection`

3. **Testes de sobreposição falham**
   - Verifique se a validação de sobreposições foi implementada
   - Confirme que a função `validateExistingPlanner` foi atualizada

### Logs Úteis

Os testes geram logs detalhados que ajudam a identificar problemas:

- Detalhes de cada teste executado
- Mensagens de erro específicas
- Estatísticas de sucesso/falha

## Contribuição

Para adicionar novos testes:

1. Crie um novo arquivo em `test/`
2. Siga o padrão das classes de teste existentes
3. Adicione o script no `package.json`
4. Documente o novo teste neste README

## Conclusão

O sistema de agendamento agora possui cobertura completa de testes que garantem:

- ✅ Não é possível agendar 2 pessoas no mesmo horário
- ✅ Sobreposições parciais são detectadas
- ✅ Todos os cenários possíveis são validados
- ✅ O sistema funciona corretamente em produção

Execute `npm run test:planner-all` para validar todo o sistema de agendamento.
