const mongoose = require("mongoose");
const { google } = require("googleapis");
const Planner = require("../models/planner");
const moment = require("moment");
require('dotenv').config();

async function createPlannerService(data) {
  let newPlanner = null;
  try {
    const eventId = await addEventToGoogleCalendar(data);
    data.eventId = eventId;
    newPlanner = await Planner.create(data);
    const collections = await mongoose.connection.db.listCollections().toArray();
    const isCollectionCreated = collections.some(collection => collection.name === 'planners');

    if (isCollectionCreated) {

    } else {

    }

    return newPlanner;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    if (newPlanner) {
      await Planner.deleteOne({ _id: newPlanner._id });
    }
    throw new Error("Erro ao criar agendamento.");
  }
}

async function addEventToGoogleCalendar(eventData) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      private_key: process.env.GOOGLE_PRIVATE_KEY,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = "naagibz@gmail.com";

  const startDateTime = `${eventData.date}T${eventData.time}:00-03:00`;
  const endHour = (parseInt(eventData.time.split(":")[0]) + 1) % 24;
  const endDateTime = `${eventData.date}T${endHour
    .toString()
    .padStart(2, "0")}:${eventData.time.split(":")[1]}:00-03:00`;

  const description = `Tipo de Serviço: ${eventData.service || "Não informado"}
    Telefone/Contato: ${eventData.contact || "Não informado"}
    Profissional Responsável: ${eventData.responsible || "Não informado"}
    Observações: ${eventData.notes || "Sem observações."}`;

  const event = {
    summary: `Consulta: ${eventData.paciente}`,
    description: description.trim(),
    start: {
      dateTime: startDateTime,
      timeZone: "America/Sao_Paulo",
    },
    end: {
      dateTime: endDateTime,
      timeZone: "America/Sao_Paulo",
    },
  };

  try {
    const eventResponse = await calendar.events.insert({
      calendarId,
      resource: event,
    });
    return eventResponse.data.id;
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
    }
    throw new Error("Erro ao criar evento no Google Calendar");
  }
}

async function getAllPlanners(query) {
  try {
    const filters = {};

    if (query && query.paciente) {
      filters.paciente = { $regex: query.paciente, $options: 'i' };
    }

    if (query && query.date) {
      const date = moment(query.date, "YYYY-MM-DD");
      const now = moment();

      filters.date = date.format("YYYY-MM-DD");

      if (date.isSame(now, 'day')) {
        filters.time = { $gte: now.format("HH:mm") };
      }
    }

    if (query && query.week) {
      const startOfWeek = moment().startOf('week').format("YYYY-MM-DD");
      const endOfWeek = moment().endOf('week').format("YYYY-MM-DD");

      filters.date = {
        $gte: startOfWeek,
        $lte: endOfWeek,
      };
    }

    const planners = await Planner.find(filters).sort({ time: 1 });
    return planners;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw new Error("Erro ao buscar agendamentos.");
  }
}

async function getPlannerByIdService(id) {
  try {
    const planner = await Planner.findById(id);
    return planner;
  } catch (error) {
    throw new Error("Erro ao buscar agendamento por ID.");
  }
}

async function updatePlannerService(id, data) {
  try {
    const planner = await Planner.findById(id);
    if (!planner) {
      console.error(`Agendamento com ID ${id} não encontrado.`);
      throw new Error("Agendamento não encontrado.");
    }

    if (!planner.eventId) {
      console.error(`Evento do Google Calendar não encontrado para o agendamento ${id}.`);
      throw new Error("Evento no Google Calendar não encontrado.");
    }

    await updateEventInGoogleCalendar(planner.eventId, data);

    const updatedPlanner = await Planner.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updatedPlanner;
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    throw new Error("Erro ao atualizar agendamento.");
  }
}

async function updateEventInGoogleCalendar(eventId, updatedData) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      private_key: process.env.GOOGLE_PRIVATE_KEY,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = "naagibz@gmail.com";

  const startDateTime = `${updatedData.date}T${updatedData.time}:00-03:00`;
  const endHour = (parseInt(updatedData.time.split(":")[0]) + 1) % 24;
  const endDateTime = `${updatedData.date}T${endHour
    .toString()
    .padStart(2, "0")}:${updatedData.time.split(":")[1]}:00-03:00`;

  const description = `
    Tipo de Serviço: ${updatedData.service || "Não informado"}
    Telefone/Contato: ${updatedData.contact || "Não informado"}
    Profissional Responsável: ${updatedData.responsible || "Não informado"}
    Observações: ${updatedData.notes || "Sem observações."}
  `;

  const event = {
    summary: `Consulta: ${updatedData.paciente}`,
    description: description.trim(),
    start: {
      dateTime: startDateTime,
      timeZone: "America/Sao_Paulo",
    },
    end: {
      dateTime: endDateTime,
      timeZone: "America/Sao_Paulo",
    },
  };

  try {
    await calendar.events.update({
      calendarId,
      eventId,
      resource: event,
    });
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    throw new Error("Erro ao atualizar evento no Google Calendar.");
  }
}

async function deleteEventFromGoogleCalendar(eventId) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      private_key: process.env.GOOGLE_PRIVATE_KEY,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = "naagibz@gmail.com";

  try {
    await calendar.events.delete({
      calendarId,
      eventId,
    });
  } catch (error) {
    console.error(`Erro ao excluir evento com ID ${eventId}:`, error);
    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
    }
    throw new Error("Erro ao excluir evento no Google Calendar.");
  }
}

async function deletePlannerService(id) {
  try {
    const planner = await Planner.findById(id);
    if (!planner) {
      console.error(`Agendamento com ID ${id} não encontrado no banco de dados.`);
      throw new Error("Agendamento não encontrado.");
    }

    if (!planner.eventId) {
      console.error(`Evento do Google Calendar não encontrado para o agendamento ${id}.`);
      throw new Error("Evento no Google Calendar não encontrado.");
    }

    await deleteEventFromGoogleCalendar(planner.eventId);

    await Planner.findByIdAndDelete(planner._id);
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    throw new Error("Erro ao excluir agendamento.");
  }
}

module.exports = {
  getAllPlanners,
  getPlannerByIdService,
  createPlannerService,
  updatePlannerService,
  deletePlannerService,
};