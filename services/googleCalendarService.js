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
    const startDateTime = new Date(`${eventData.date}T${eventData.time}:00`);
    
    let endDateTime;
    if (eventData.endDate && eventData.endTime) {
      endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}:00`);
    } else {
      endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    }

    const event = {
      summary: eventData.service,
      location: "",
      description: eventData.notes,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
    }
    throw new Error("Erro ao criar evento no Google Calendar.");
  }
}

async function updateEventInCalendar(eventId, eventData) {
  const auth = await getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  try {
    const startDateTime = new Date(`${eventData.date}T${eventData.time}:00`);
    
    let endDateTime;
    if (eventData.endDate && eventData.endTime) {
      endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}:00`);
    } else {
      endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    }

    const event = {
      summary: eventData.service,
      location: "",
      description: eventData.notes,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.update({
      calendarId,
      eventId,
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
    }
    throw new Error("Erro ao atualizar evento no Google Calendar.");
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
  } catch (error) {
    console.error(`Erro ao excluir evento com ID ${eventId}`, error);
    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
    }
    throw new Error("Erro ao excluir evento no Google Calendar.");
  }
}

module.exports = { createEvent, updateEventInCalendar, deleteEvent };
