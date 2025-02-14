const mongoose = require("mongoose");
const {
  getPacientesService,
  getPacienteByIdService,
  createPacienteService,
  updatePacienteService,
  deletePacienteService,
} = require("../services/pacientes");

async function getPacientes(req, res) {
  try {
    const { nome, aniversariantesSemana } = req.query || {};
    const pacientes = await getPacientesService({ nome, aniversariantesSemana });
    return res.status(200).json(pacientes);
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    return res.status(500).json({ error: error.message });
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
    if (!req || !res) {
      throw new Error("Requisição ou resposta não definida.");
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send("Nenhum dado foi enviado.");
    }

    const pacienteData = req.body;
    const requiredFields = [
      "nome",
      "idade",
      "dataNascimento",
    ];

    for (const field of requiredFields) {
      if (pacienteData[field] === undefined) {
        return res.status(400).send(`O campo "${field}" é obrigatório.`);
      }
    }

    const newPaciente = await createPacienteService(pacienteData);
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
