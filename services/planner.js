const mongoose = require('mongoose');
const { google } = require("googleapis");  
const Planner = require("../models/planner");

async function createPlannerService(data) {
  let newPlanner = null;
  try {
    await addEventToGoogleCalendar(data);
    newPlanner = await Planner.create(data);
    const collections = await mongoose.connection.db.listCollections().toArray();
    const isCollectionCreated = collections.some(collection => collection.name === 'planners');

    if (isCollectionCreated) {
      console.log("A coleção 'planners' foi criada com sucesso.");
    } else {
      console.log("A coleção 'planners' não foi criada.");
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
  const endDateTime = `${eventData.date}T${endHour.toString().padStart(2, "0")}:${eventData.time.split(":")[1]}:00-03:00`;

  const description = `
    Tipo de Serviço: ${eventData.service || "Não informado"}
    Telefone/Contato: ${eventData.contact || "Não informado"}
    Profissional Responsável: ${eventData.responsible || "Não informado"}
    Observações: ${eventData.notes || "Sem observações."}
  `;

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
    return eventResponse.data;
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
    }
    throw new Error("Erro ao criar evento no Google Calendar");
  }
}

module.exports = {
  createPlannerService,
};
