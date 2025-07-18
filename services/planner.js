const Planner = require("../models/planner");
const moment = require("moment-timezone");
const googleCalendarService = require("./googleCalendarService");
const {
  validateId,
  validateRequiredFields,
} = require("../utils/validationUtils");
require("dotenv").config();

async function createPlannerService(data) {
  try {
    validateRequiredFields(data, ["date", "time", "paciente"]);
    await validateExistingPlanner(data.date, data.time);
    const event = await googleCalendarService.createEvent(data);
    data.eventId = event.id;
    return await Planner.create(data);
  } catch (error) {
    handleServiceError("Erro ao criar agendamento", error);
  }
}

async function getAllPlanners(query) {
  try {
    const { pageNumber, date, paciente, nextAppointments } = query;

    const oldestPlanner = await Planner.findOne().sort({ date: 1 });
    const newestPlanner = await Planner.findOne().sort({ date: -1 });
    if (!oldestPlanner || !newestPlanner) {
      return {
        data: [],
        pagination: { total: 0, totalPages: 0, currentPage: 0 },
      };
    }

    const startDate = moment(oldestPlanner.date)
      .tz("America/Sao_Paulo")
      .startOf("week");
    const endDate = moment(newestPlanner.date)
      .tz("America/Sao_Paulo")
      .endOf("week");
    const currentWeek = moment().tz("America/Sao_Paulo").startOf("week");
    const totalWeeks = Math.ceil(endDate.diff(startDate, "weeks", true));
    const currentPage =
      Math.ceil(currentWeek.diff(startDate, "weeks", true)) + 1;
    const page = Math.max(
      1,
      Math.min(parseInt(pageNumber, 10) || currentPage, totalWeeks)
    );
    const weekStart = startDate.clone().add(page - 1, "weeks");
    const weekEnd = weekStart.clone().endOf("week");

    const filters = {};
    if (paciente) {
      if (paciente.length >= 3) {
        filters.paciente = { $regex: paciente, $options: "i" };
      } else {
        filters.paciente = paciente;
      }
    }

    if (date) {
      filters.date = moment.tz(date, "America/Sao_Paulo").format("YYYY-MM-DD");
    } else if (!paciente) {
      filters.date = {
        $gte: weekStart.format("YYYY-MM-DD"),
        $lte: weekEnd.format("YYYY-MM-DD"),
      };
    }

    if (nextAppointments === "true") {
      const now = moment().tz("America/Sao_Paulo");
      const startOfDay = now.clone().startOf("day");
      filters.date = {
        $gte: startOfDay.format("YYYY-MM-DD"),
        $lte: now.clone().endOf("day").format("YYYY-MM-DD"),
      };
      filters.time = { $gte: now.format("HH:mm") };
    }

    const planners = await Planner.find(filters).sort({ date: 1, time: 1 });

    return {
      data: planners,
      pagination: {
        totalPages: totalWeeks,
        currentPage: page,
      },
    };
  } catch (error) {
    handleServiceError("Erro ao buscar agendamentos", error);
  }
}

async function getPlannerByIdService(id) {
  try {
    validateId(id);
    return await Planner.findById(id);
  } catch (error) {
    handleServiceError("Erro ao buscar agendamento por ID", error);
  }
}

async function updatePlannerService(id, data) {
  try {
    validateId(id);
    validateRequiredFields(data, ["date", "time"]);
    const planner = await getPlannerByIdService(id);
    validatePlanner(planner, id);
<<<<<<< HEAD

    await validateExistingPlanner(data.date, data.time, id);

=======
    
    // Validar conflitos excluindo o agendamento atual
    await validateExistingPlanner(data.date, data.time, id);
    
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
    await googleCalendarService.updateEventInCalendar(planner.eventId, data);
    return await Planner.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    handleServiceError("Erro ao atualizar agendamento", error);
  }
}

async function deletePlannerService(id) {
  try {
    validateId(id);
    const planner = await getPlannerByIdService(id);
    validatePlanner(planner, id);
    await googleCalendarService.deleteEvent(planner.eventId);
    await Planner.findByIdAndDelete(id);
  } catch (error) {
    handleServiceError("Erro ao excluir agendamento", error);
  }
}

async function validateExistingPlanner(date, time, excludeId = null) {
<<<<<<< HEAD
  console.log(
    `🔍 DEBUG: Validando agendamento - Data: ${date}, Hora: ${time}, ExcludeId: ${excludeId}`
  );
  console.log(
    `🔍 DEBUG: Tipo do excludeId: ${typeof excludeId}, Valor: ${excludeId}`
  );

=======
  console.log(`🔍 DEBUG: Validando agendamento - Data: ${date}, Hora: ${time}, ExcludeId: ${excludeId}`);
  console.log(`🔍 DEBUG: Tipo do excludeId: ${typeof excludeId}, Valor: ${excludeId}`);
  
  // Verificar conflito exato primeiro
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
  const exactQuery = { date, time };
  if (excludeId) {
    exactQuery._id = { $ne: excludeId };
    console.log(`🔍 DEBUG: Excluindo ID: ${excludeId} da validação`);
  }
<<<<<<< HEAD

  console.log(`🔍 DEBUG: Query de conflito exato:`, exactQuery);
  const exactConflict = await Planner.findOne(exactQuery);
  console.log(
    `🔍 DEBUG: Conflito exato encontrado:`,
    exactConflict ? "SIM" : "NÃO"
  );

  if (exactConflict) {
    console.log(
      `🔍 DEBUG: Conflito exato detectado - ID: ${exactConflict._id}, Data: ${exactConflict.date}, Hora: ${exactConflict.time}`
    );
    console.log(
      `🔍 DEBUG: Comparando horários - Novo: "${time}", Existente: "${exactConflict.time}"`
    );
=======
  
  console.log(`🔍 DEBUG: Query de conflito exato:`, exactQuery);
  const exactConflict = await Planner.findOne(exactQuery);
  console.log(`🔍 DEBUG: Conflito exato encontrado:`, exactConflict ? 'SIM' : 'NÃO');
  
  if (exactConflict) {
    console.log(`🔍 DEBUG: Conflito exato detectado - ID: ${exactConflict._id}, Data: ${exactConflict.date}, Hora: ${exactConflict.time}`);
    console.log(`🔍 DEBUG: Comparando horários - Novo: "${time}", Existente: "${exactConflict.time}"`);
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
    console.log(`🔍 DEBUG: São iguais? ${time === exactConflict.time}`);
    throw new Error("Já existe um agendamento para essa data e horário.");
  }

<<<<<<< HEAD
  const appointmentStart = moment.tz(`${date}T${time}`, "America/Sao_Paulo");
  const appointmentEnd = appointmentStart.clone().add(1, "hour");

  console.log(
    `🔍 DEBUG: Novo agendamento - Início: ${appointmentStart.format(
      "YYYY-MM-DD HH:mm"
    )}, Fim: ${appointmentEnd.format("YYYY-MM-DD HH:mm")}`
  );

=======
  // Verificar sobreposições parciais
  const appointmentStart = moment.tz(`${date}T${time}`, "America/Sao_Paulo");
  const appointmentEnd = appointmentStart.clone().add(1, "hour");
  
  console.log(`🔍 DEBUG: Novo agendamento - Início: ${appointmentStart.format('YYYY-MM-DD HH:mm')}, Fim: ${appointmentEnd.format('YYYY-MM-DD HH:mm')}`);
  
  // Buscar todos os agendamentos na mesma data
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
  const sameDateQuery = { date };
  if (excludeId) {
    sameDateQuery._id = { $ne: excludeId };
  }
<<<<<<< HEAD

  console.log(
    `🔍 DEBUG: Query para agendamentos na mesma data:`,
    sameDateQuery
  );
  const allPlannersOnDate = await Planner.find(sameDateQuery);
  console.log(
    `🔍 DEBUG: Agendamentos encontrados na mesma data: ${allPlannersOnDate.length}`
  );

  for (const planner of allPlannersOnDate) {
    const existingStart = moment.tz(
      `${planner.date}T${planner.time}`,
      "America/Sao_Paulo"
    );
    const existingEnd = existingStart.clone().add(1, "hour");

    console.log(
      `🔍 DEBUG: Verificando agendamento existente - ID: ${
        planner._id
      }, Início: ${existingStart.format(
        "YYYY-MM-DD HH:mm"
      )}, Fim: ${existingEnd.format("YYYY-MM-DD HH:mm")}`
    );
    console.log(
      `🔍 DEBUG: Horário existente: "${planner.time}", Novo horário: "${time}"`
    );

    const hasOverlap =
      appointmentStart.isBefore(existingEnd) &&
      appointmentEnd.isAfter(existingStart);
    console.log(
      `🔍 DEBUG: Sobreposição detectada: ${hasOverlap ? "SIM" : "NÃO"}`
    );

    if (hasOverlap) {
      console.log(
        `🔍 DEBUG: Sobreposição encontrada! Novo: ${appointmentStart.format(
          "HH:mm"
        )}-${appointmentEnd.format("HH:mm")}, Existente: ${existingStart.format(
          "HH:mm"
        )}-${existingEnd.format("HH:mm")}`
      );
      throw new Error("Existe sobreposição de horários com outro agendamento.");
    }
  }

=======
  
  console.log(`🔍 DEBUG: Query para agendamentos na mesma data:`, sameDateQuery);
  const allPlannersOnDate = await Planner.find(sameDateQuery);
  console.log(`🔍 DEBUG: Agendamentos encontrados na mesma data: ${allPlannersOnDate.length}`);
  
  // Verificar sobreposições com cada agendamento existente
  for (const planner of allPlannersOnDate) {
    const existingStart = moment.tz(`${planner.date}T${planner.time}`, "America/Sao_Paulo");
    const existingEnd = existingStart.clone().add(1, "hour");
    
    console.log(`🔍 DEBUG: Verificando agendamento existente - ID: ${planner._id}, Início: ${existingStart.format('YYYY-MM-DD HH:mm')}, Fim: ${existingEnd.format('YYYY-MM-DD HH:mm')}`);
    console.log(`🔍 DEBUG: Horário existente: "${planner.time}", Novo horário: "${time}"`);
    
    // Verificar se há sobreposição
    // Sobreposição ocorre quando:
    // 1. O novo agendamento começa antes do existente terminar E
    // 2. O novo agendamento termina depois do existente começar
    const hasOverlap = appointmentStart.isBefore(existingEnd) && appointmentEnd.isAfter(existingStart);
    console.log(`🔍 DEBUG: Sobreposição detectada: ${hasOverlap ? 'SIM' : 'NÃO'}`);
    
    if (hasOverlap) {
      console.log(`🔍 DEBUG: Sobreposição encontrada! Novo: ${appointmentStart.format('HH:mm')}-${appointmentEnd.format('HH:mm')}, Existente: ${existingStart.format('HH:mm')}-${existingEnd.format('HH:mm')}`);
      throw new Error("Existe sobreposição de horários com outro agendamento.");
    }
  }
  
>>>>>>> c059688763e76d95c86dc28f38f28595e0e21c71
  console.log(`🔍 DEBUG: Validação concluída - Nenhum conflito encontrado`);
}

function validatePlanner(planner, id) {
  if (!planner) throw new Error(`Agendamento com ID ${id} não encontrado.`);
  if (!planner.eventId)
    throw new Error("Evento no Google Calendar não encontrado.");
}

function handleServiceError(message, error) {
  console.error(message, error);
  throw new Error(error.message || message);
}

module.exports = {
  getAllPlanners,
  getPlannerByIdService,
  createPlannerService,
  updatePlannerService,
  deletePlannerService,
};
