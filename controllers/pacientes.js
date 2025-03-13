const {
  getPacientesService,
  getPacienteByIdService,
  createPacienteService,
  updatePacienteService,
  deletePacienteService,
} = require("../services/pacientes");
const { uploadImageToCloudinary } = require("../services/cloudinaryService");
const {
  validateId,
  validateRequiredFields,
  validateFileType,
} = require("../utils/validationUtils");

async function getPacientes(req, res) {
  const { nome, aniversariantesSemana } = req.query || {};
  const pacientes = await getPacientesService({ nome, aniversariantesSemana });
  res.status(200).json(pacientes);
}

async function getPacienteById(req, res) {
  const { id } = req.params;
  validateId(id);
  const paciente = await getPacienteByIdService(id);
  if (!paciente) {
    return res.status(404).send("Paciente não encontrado.");
  }
  res.status(200).json(paciente);
}

async function createPaciente(req, res) {
  const requiredFields = ["nome", "idade", "dataNascimento"];
  validateRequiredFields(req.body, requiredFields);

  let image = null;
  if (req.file) {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    validateFileType(req.file, allowedFileTypes);
    image = await uploadImageToCloudinary(file, "usuarios");
  }

  const newPaciente = await createPacienteService({ ...req.body, image });
  res.status(201).json(newPaciente);
}

async function updatePaciente(req, res) {
  const { id } = req.params;
  validateId(id);
  const updatedData = req.body;
  const updatedPaciente = await updatePacienteService(id, updatedData);
  if (!updatedPaciente) {
    return res.status(404).send("Paciente não encontrado.");
  }
  res.status(200).json(updatedPaciente);
}

async function deletePaciente(req, res) {
  const { id } = req.params;
  validateId(id);
  const paciente = await deletePacienteService(id);
  if (!paciente) {
    return res.status(404).send("Paciente não encontrado.");
  }
  res.status(200).send("Paciente excluído com sucesso.");
}

module.exports = {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente,
};
