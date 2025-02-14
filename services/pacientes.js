const Paciente = require("../models/pacientes");

async function getPacientesService(query) {
  try {
    const filters = {};

    if (query?.nome) {
      filters.nome = { $regex: query.nome, $options: "i" };
    }

    if (query?.genero) {
      filters.genero = query.genero;
    }

    if (query?.idade) {
      filters.idade = { $gte: query.idade };
    }

    const pacientes = await Paciente.find(filters).sort({ nome: 1 });

    if (!pacientes || pacientes.length === 0) {
      throw new Error("Nenhum paciente encontrado.");
    }

    return pacientes;
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    throw new Error("Erro ao buscar pacientes.");
  }
}

async function getPacienteByIdService(id) {
  try {
    return await Paciente.findById(id);
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    throw new Error("Erro ao buscar paciente.");
  }
}

async function createPacienteService(pacienteData) {
  try {
    if (!pacienteData || Object.keys(pacienteData).length === 0) {
      throw new Error("Dados de paciente inválidos.");
    }

    const newPaciente = await new Paciente(pacienteData).save();
    return newPaciente;
  } catch (error) {
    console.error("Erro ao criar paciente:", error);
    throw new Error("Erro ao criar paciente.");
  }
}

async function updatePacienteService(id, updatedData) {
  try {
    const existingPaciente = await Paciente.findById(id);
    if (!existingPaciente) {
      throw new Error("Paciente não encontrado.");
    }

    return await Paciente.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    throw new Error("Erro ao atualizar paciente.");
  }
}

async function deletePacienteService(id) {
  try {
    const deletedPaciente = await Paciente.findByIdAndDelete(id);
    if (!deletedPaciente) {
      throw new Error("Paciente não encontrado.");
    }
    return deletedPaciente;
  } catch (error) {
    console.error("Erro ao excluir paciente:", error);
    throw new Error("Erro ao excluir paciente.");
  }
}

module.exports = {
  getPacientesService,
  getPacienteByIdService,
  createPacienteService,
  updatePacienteService,
  deletePacienteService,
};