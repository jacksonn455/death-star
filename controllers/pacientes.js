const mongoose = require("mongoose");
const {
  getPacientesService,
  getPacienteByIdService,
  createPacienteService,
  updatePacienteService,
  deletePacienteService,
} = require("../services/pacientes");
const cloudinary = require('../config/cloudinary');

async function getPacientes(req, res) {
  try {
    const { nome, aniversariantesSemana } = req.query || {};
    const pacientes = await getPacientesService({ nome, aniversariantesSemana });
    return pacientes;
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    throw error;
  }
}

async function getPacienteById(req, res) {
  try {
    const id = req.params.id;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const paciente = await getPacienteByIdService(id);
      if (!paciente) {
        return res.status(404).send("Paciente não encontrado.");
      }
      res.status(200).send(paciente);
    } else {
      res.status(422).send("ID inválido");
    }
  } catch (error) {
    console.error("Erro ao buscar paciente por ID:", error);
    res.status(500).send({ error: error.message });
  }
}

async function createPaciente(req, res) {
  try {
    const pacienteData = req.body;
    const requiredFields = ["nome", "idade", "dataNascimento"];

    for (const field of requiredFields) {
      if (!pacienteData[field]) {
        return res.status(400).send(`O campo "${field}" é obrigatório.`);
      }
    }

    let image = null;
    if (pacienteData.fotos) {
      const base64Data = pacienteData.fotos.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "pacientes" }, (error, result) => {
            if (error) {
              console.error("Erro ao fazer upload da imagem para o Cloudinary:", error);
              reject(error);
            }
            resolve(result);
          })
          .end(buffer);
      });

      image = uploadResult.secure_url;
    }

    const newPaciente = await createPacienteService({
      ...pacienteData,
      image: image,
    });

    res.status(201).json(newPaciente);
  } catch (error) {
    console.error("Erro ao criar paciente:", error);
    res.status(500).json({ error: error.message });
  }
}

async function updatePaciente(req, res) {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).send("ID inválido");
    }

    const updatedData = req.body;

    const updatedPaciente = await updatePacienteService(id, updatedData);
    if (!updatedPaciente) {
      return res.status(404).send("Paciente não encontrado.");
    }

    res.status(200).json(updatedPaciente);
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    res.status(500).json({ error: error.message });
  }
}

async function deletePaciente(req, res) {
  try {
    const id = req.params.id;

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const paciente = await deletePacienteService(id);
      if (!paciente) {
        return res.status(404).send("Paciente não encontrado.");
      }
      res.status(200).send("Paciente excluído com sucesso.");
    } else {
      res.status(422).send("ID inválido");
    }
  } catch (error) {
    console.error("Erro ao excluir paciente:", error);
    res.status(500).send({ error: error.message });
  }
}

module.exports = {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente,
};
