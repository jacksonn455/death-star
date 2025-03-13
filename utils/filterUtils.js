const moment = require("moment-timezone");

const buildPacienteFilters = (query) => {
  const filters = {};
  const now = moment().tz("America/Sao_Paulo");

  if (query?.aniversariantesSemana) {
    const startOfWeek = moment().startOf("week").tz("America/Sao_Paulo");
    const endOfWeek = moment().endOf("week").tz("America/Sao_Paulo");

    filters.dataNascimento = {
      $gte: startOfWeek.startOf("day").format("YYYY-MM-DD"),
      $lte: endOfWeek.endOf("day").format("YYYY-MM-DD"),
    };
  }

  if (query?.nome) {
    filters.nome = { $regex: query.nome, $options: "i" };
  }

  if (query?.dataNascimento) {
    filters.dataNascimento = query.dataNascimento;
  }

  return filters;
};

module.exports = { buildPacienteFilters };
