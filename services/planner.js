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
    const eventId = await googleCalendarService.createEvent(data);
    data.eventId = eventId;
    return await Planner.create(data);
  } catch (error) {
    handleServiceError("Erro ao criar agendamento", error);
  }
}

async function getAllPlanners(query) {
  try {
    const { pageNumber } = query;

    const oldestPlanner = await Planner.findOne().sort({ date: 1 });
    const newestPlanner = await Planner.findOne().sort({ date: -1 });
    if (!oldestPlanner || !newestPlanner) {
      return {
        data: [],
        pagination: { total: 0, totalPages: 0, currentPage: 0 },
      };
    }

    const startDate = moment(oldestPlanner.date).startOf("week");
    const endDate = moment(newestPlanner.date).endOf("week");
    const currentWeek = moment().startOf("week");
    const totalWeeks = Math.ceil(endDate.diff(startDate, "weeks", true));
    const currentPage =
      Math.ceil(currentWeek.diff(startDate, "weeks", true)) + 1;
    const page = Math.max(
      1,
      Math.min(parseInt(pageNumber, 10) || currentPage, totalWeeks)
    );
    const weekStart = startDate.clone().add(page - 1, "weeks");
    const weekEnd = weekStart.clone().endOf("week");

    const filters = {
      date: {
        $gte: weekStart.format("YYYY-MM-DD"),
        $lte: weekEnd.format("YYYY-MM-DD"),
      },
    };

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

async function validateExistingPlanner(date, time) {
  const existingPlanner = await Planner.findOne({ date, time });
  if (existingPlanner) {
    throw new Error("Já existe um agendamento para essa data e horário.");
  }
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
