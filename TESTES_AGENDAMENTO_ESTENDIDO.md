# Testes do Sistema de Agendamento Estendido

Este documento descreve os testes implementados para validar o sistema de agendamento com data/hora de término (endDate/endTime), garantindo que todos os cenários possíveis sejam cobertos.

## Visão Geral

O sistema de agendamento foi estendido para permitir que o usuário escolha data e hora de término, além da data e hora de início. Os testes foram criados em três níveis:

1. **Testes Estendidos** (`test-planner-extended.js`) - Validações fundamentais com endDate/endTime
2. **Testes de Sobreposição Estendidos** (`test-overlap-extended.js`) - Validação de sobreposições com endDate/endTime
3. **Testes de Validação Estendidos** (`test-validation-extended.js`) - Validação de dados inválidos

## Funcionalidades Testadas

### ✅ Validações de Conflito com EndDate/EndTime

- **Conflito Exato**: Mesma data, hora de início e término
- **Sobreposição Parcial**: Agendamentos que se sobrepõem parcialmente
- **Sobreposição Completa**: Um agendamento dentro do outro
- **Conflito na Atualização**: Validação ao atualizar agendamentos
- **Agendamentos Cruzando o Dia**: Validação de agendamentos que passam da meia-noite

### ✅ Validações de Formato com EndDate/EndTime

- **Data de Término**: Formato YYYY-MM-DD, datas inválidas, meses/dias inexistentes
- **Hora de Término**: Formato HH:mm, horas/minutos inválidos, formatos incorretos
- **Campos Obrigatórios**: Paciente, data de início, hora de início
- **Campos Opcionais**: Data de término, hora de término

### ✅ Cenários Válidos com EndDate/EndTime

- **Agendamentos Consecutivos**: Horários seguidos sem sobreposição
- **Datas Diferentes**: Mesmo horário em datas diferentes
- **Horários Extremos**: 00:00, 23:59, horários comerciais
- **Agendamentos Curtos**: Duração menor que 1 hora
- **Agendamentos Longos**: Duração maior que 1 hora
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

### Comandos Disponíveis

```bash
# Teste estendido do planner (todos os cenários)
npm run test:planner-extended

# Teste de sobreposições estendidas
npm run test:planner-overlap-extended

# Teste de validação estendida
npm run test:validation-extended

# Todos os testes estendidos (recomendado)
npm run test:planner-extended-complete

# Teste específico
node test/test-planner-extended.js
node test/test-overlap-extended.js
node test/test-validation-extended.js
```

## Cenários de Teste Detalhados

### 1. Testes Estendidos (`test-planner-extended.js`)

#### ✅ Criação de Agendamento Válido (Duração Padrão)

- Valida criação com dados corretos (1 hora automática)
- Verifica retorno do ID do agendamento

#### ✅ Criação de Agendamento com EndDate/EndTime

- Valida criação com data/hora de término específica
- Testa agendamentos de 2 horas, 30 minutos, etc.

#### ✅ Agendamento com Data de Término Diferente

- Valida agendamentos que cruzam o dia (23:00-01:00)
- Testa agendamentos que passam da meia-noite

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

#### ✅ Validação de EndDate/EndTime

- Testa data/hora de término anterior ao início
- Valida formatos incorretos de endDate/endTime

#### ✅ Operações CRUD

- Busca de agendamentos
- Atualização de agendamentos com endDate/endTime
- Exclusão de agendamentos

### 2. Testes de Sobreposição Estendidos (`test-overlap-extended.js`)

#### ✅ Sobreposição Exata com EndTime

- Agendamento 1: 10:00-12:00
- Tentativa: 10:00-12:00
- Verifica detecção da sobreposição exata

#### ✅ Sobreposição Parcial - Início Antes do Fim

- Agendamento 1: 14:00-16:00
- Tentativa: 15:00-17:00
- Verifica detecção da sobreposição parcial

#### ✅ Sobreposição Parcial - Fim Depois do Início

- Agendamento 1: 18:00-20:00
- Tentativa: 17:00-19:00
- Verifica detecção da sobreposição parcial

#### ✅ Sobreposição Completa - Novo Dentro do Existente

- Agendamento 1: 09:00-12:00
- Tentativa: 10:00-11:00
- Verifica detecção da sobreposição completa

#### ✅ Sobreposição Completa - Existente Dentro do Novo

- Agendamento 1: 13:00-14:00
- Tentativa: 12:00-15:00
- Verifica detecção da sobreposição completa

#### ✅ Agendamentos Consecutivos Válidos

- 08:00-09:00
- 09:00-10:00
- 10:00-11:00
- Verifica que são permitidos

#### ✅ Agendamentos Cruzando o Dia

- Agendamento 1: 23:00-01:00 (próximo dia)
- Tentativa: 23:30-01:30 (sobrepõe)
- Verifica detecção da sobreposição

#### ✅ Agendamentos Curtos

- Agendamento 1: 14:00-14:30
- Tentativa: 14:15-14:45 (sobrepõe)
- Verifica detecção da sobreposição

#### ✅ Agendamentos Mistos

- Mistura de agendamentos com e sem endDate/endTime
- Valida que todos funcionam corretamente

### 3. Testes de Validação Estendidos (`test-validation-extended.js`)

#### ✅ Formato de Data Inválido

- Testa datas inexistentes (2024-02-30)
- Valida meses inexistentes (2024-13-01)
- Verifica dias inexistentes (2024-12-00)

#### ✅ Formato de Hora Inválido

- Testa horas inválidas (25:00)
- Valida minutos inválidos (12:60)
- Verifica formatos incorretos (12:, :30)

#### ✅ Formato de EndDate Inválido

- Testa datas de término inexistentes
- Valida meses de término inexistentes
- Verifica dias de término inexistentes

#### ✅ Formato de EndTime Inválido

- Testa horas de término inválidas
- Valida minutos de término inválidos
- Verifica formatos incorretos de endTime

#### ✅ EndTime Antes do StartTime

- Testa hora de término anterior à de início
- Valida rejeição correta

#### ✅ EndDate Antes do StartDate

- Testa data de término anterior à de início
- Valida rejeição correta

#### ✅ EndTime Igual ao StartTime

- Testa hora de término igual à de início
- Valida rejeição correta

#### ✅ Campos Obrigatórios Ausentes

- Testa ausência de date, time, paciente
- Valida rejeição correta

#### ✅ Valores de Data Inválidos

- Testa todas as combinações de datas inválidas
- Valida rejeição correta

#### ✅ Valores de Hora Inválidos

- Testa todas as combinações de horas inválidas
- Valida rejeição correta

#### ✅ Valores de EndDate Inválidos

- Testa todas as combinações de endDate inválidos
- Valida rejeição correta

#### ✅ Valores de EndTime Inválidos

- Testa todas as combinações de endTime inválidos
- Valida rejeição correta

#### ✅ Agendamentos Cruzando o Dia

- Testa agendamentos válidos que cruzam o dia
- Valida aceitação correta

#### ✅ Agendamentos Válidos

- Testa agendamentos padrão (1 hora)
- Testa agendamentos com término específico
- Testa agendamentos curtos
- Valida aceitação correta

## Melhorias Implementadas

### 🔧 Suporte a EndDate/EndTime

O sistema foi estendido para suportar data e hora de término:

```javascript
// Agendamento padrão (1 hora automática)
{
  date: "2024-01-15",
  time: "14:00",
  paciente: "João Silva"
}

// Agendamento com término específico
{
  date: "2024-01-15",
  time: "14:00",
  endDate: "2024-01-15",
  endTime: "16:00",
  paciente: "João Silva"
}
```

### 🔧 Validação de Sobreposições com EndDate/EndTime

O sistema foi melhorado para detectar sobreposições considerando endDate/endTime:

```javascript
const appointmentStart = moment.tz(`${date}T${time}`, "America/Sao_Paulo");
let appointmentEnd;

if (endDate && endTime) {
  appointmentEnd = moment.tz(`${endDate}T${endTime}`, "America/Sao_Paulo");
} else {
  appointmentEnd = appointmentStart.clone().add(1, "hour");
}
```

### 🔧 Validação de Dados com EndDate/EndTime

O sistema valida formatos e valores de endDate/endTime:

```javascript
body("endDate").optional().isISO8601().withMessage("Data de término inválida"),
body("endTime").optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora de término inválida"),
```

## Compatibilidade

### ✅ Compatibilidade com Agendamentos Existentes

- Agendamentos sem endDate/endTime continuam funcionando
- Duração padrão de 1 hora é mantida
- Validações existentes continuam funcionando

### ✅ Migração Automática

- Não é necessário migrar dados existentes
- Sistema funciona com e sem endDate/endTime
- Validações são aplicadas conforme disponibilidade dos campos

## Próximos Passos

1. **Teste a API** usando os novos testes estendidos
2. **Integre com o frontend** usando os novos campos
3. **Monitore logs** para garantir que não há erros
4. **Personalize validações** conforme necessário

## Suporte

Para dúvidas ou problemas:

1. Execute os testes estendidos para verificar se tudo está funcionando
2. Verifique os logs do servidor para identificar erros
3. Consulte a documentação dos testes básicos para comparação

---

**🎯 Sistema de Agendamento Estendido - Pronto para Uso! 🚀** 