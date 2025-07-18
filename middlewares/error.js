const errorMiddleware = (error, req, res, next) => {
  console.error("Erro:", error.message);

  if (
    error.message.includes("inválido") ||
    error.message.includes("obrigatório") ||
    error.message.includes("Já existe um agendamento") ||
    error.message.includes("sobreposição de horários")
  ) {
    return res.status(400).json({ error: error.message });
  }

  if (error.message.includes("não encontrado")) {
    return res.status(404).json({ error: error.message });
  }

  res.status(500).json({ error: "Erro interno no servidor." });
};

module.exports = errorMiddleware;
