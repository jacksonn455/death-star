const mongoose = require("mongoose");
const {
  getPacientesService,
  getPacienteByIdService,
  createPacienteService,
  updatePacienteService,
  deletePacienteService,
} = require("../services/pacientes");
const cloudinary = require("../config/cloudinary");

async function getPacientes(req, res) {
  try {
    const { nome, aniversariantesSemana } = req.query || {};
    const pacientes = await getPacientesService({
      nome,
      aniversariantesSemana,
    });
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

      if (!res.headersSent) {
        res.status(200).send(paciente);
      } else {
      }
    } else {
      if (!res.headersSent) {
        return res.status(422).send("ID inválido");
      }
    }
  } catch (error) {
    console.error("Erro ao buscar paciente por ID:", error);
    if (!res.headersSent) {
      res.status(500).send({ error: error.message });
    }
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
    if (req.file) {
      const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedFileTypes.includes(req.file.mimetype)) {
        return res
          .status(400)
          .send(
            "Tipo de arquivo inválido. Apenas JPG, JPEG ou PNG são permitidos."
          );
      }

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "pacientes" }, (error, result) => {
            if (error) {
              console.error(
                "Erro ao fazer upload da imagem para o Cloudinary:",
                error
              );
              reject(error);
            }
            resolve(result);
          })
          .end(req.file.buffer);
      });

      image = uploadResult.secure_url;
    }

    const newPaciente = await createPacienteService({
      ...req.body,
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
