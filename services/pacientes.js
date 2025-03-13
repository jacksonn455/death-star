const Paciente = require("../models/pacientes");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("./cloudinaryService");
const { buildPacienteFilters } = require("../utils/filterUtils");

async function getPacientesService(query) {
  try {
    const filters = buildPacienteFilters(query);
    const pacientes = await Paciente.find(filters).sort({ nome: 1 });
    return pacientes || [];
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    throw new Error("Erro ao buscar pacientes.");
  }
}

async function getPacienteByIdService(id) {
  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      throw new Error("Paciente não encontrado.");
    }
    return paciente;
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    throw new Error("Erro ao buscar paciente.");
  }
}

async function createPacienteService(pacienteData, imageFile) {
  try {
    if (!pacienteData || Object.keys(pacienteData).length === 0) {
      throw new Error("Dados de paciente inválidos.");
    }

    if (imageFile) {
      pacienteData.imagem = await uploadImageToCloudinary(
        imageFile,
        "usuarios"
      );
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

    if (updatedData.imagem && typeof updatedData.imagem !== "string") {
      updatedData.imagem = await uploadImageToCloudinary(
        updatedData.imagem,
        "usuarios"
      );
    } else {
      updatedData.imagem = existingPaciente.imagem;
    }

    return await Paciente.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    throw new Error("Erro ao atualizar paciente.");
  }
}

async function deletePacienteService(id) {
  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      throw new Error("Paciente não encontrado.");
    }

    if (paciente.imagem) {
      await deleteImageFromCloudinary(paciente.imagem);
    }

    const deletedPaciente = await Paciente.findByIdAndDelete(id);
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
