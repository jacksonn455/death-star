const { google } = require("googleapis");

async function getAuthClient() {
  try {
    return new google.auth.GoogleAuth({
      credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
  } catch (error) {
    console.error("Erro ao configurar autenticação:", error);
    throw new Error("Erro ao configurar autenticação do Google Calendar.");
  }
}

const calendarId = "naagibz@gmail.com";

async function createEvent(eventData) {
  const auth = await getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  try {
    const response = await calendar.events.insert({
      calendarId,
      resource: eventData,
    });
    console.log("Evento criado com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
    }
    throw new Error("Erro ao criar evento no Google Calendar.");
  }
}

async function deleteEvent(eventId) {
  const auth = await getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  try {
    await calendar.events.delete({
      calendarId,
      eventId,
    });
    console.log(`Evento com ID ${eventId} excluído com sucesso.`);
  } catch (error) {
    console.error(`Erro ao excluir evento com ID ${eventId}`, error);
    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
    }
    throw new Error("Erro ao excluir evento no Google Calendar.");
  }
}

module.exports = { createEvent, deleteEvent };
