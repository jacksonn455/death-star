const fs = require("fs");
const {
  getTodosPacientes,
  getPacientePorId,
  inserePaciente,
  modificaPaciente,
  deletaPacientePorId,
} = require("../services/pacientes");

function getPacientes(req, res) {
  try {
    const pacientes = getTodosPacientes();
    res.send(pacientes);
  } catch (e) {
    res.status(500).send(e);
    res.send(e.message);
  }
}

function getPacientes(req, res) {
  db.query('SELECT * FROM pacientes', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor' });
    }
    return res.json(results);
  });
}

function postPaciente(req, res) {
  try {
    const pacienteNovo = req.body;

    const camposObrigatorios = ["id", "nome", "sobrenome", "idade", "dataNascimento"];
    for (const campo of camposObrigatorios) {
      if (!pacienteNovo[campo]) {
        return res.status(400).send(`O campo "${campo}" é obrigatório.`);
      }
    }

    if (typeof pacienteNovo.id !== "number") {
      return res.status(400).send('O campo "id" deve ser um número.');
    }
    if (typeof pacienteNovo.nome !== "string" || typeof pacienteNovo.sobrenome !== "string") {
      return res.status(400).send('Os campos "nome" e "sobrenome" devem ser strings.');
    }
    if (typeof pacienteNovo.idade !== "number" || pacienteNovo.idade <= 0) {
      return res.status(400).send('O campo "idade" deve ser um número maior que 0.');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(pacienteNovo.dataNascimento)) {
      return res.status(400).send('O campo "dataNascimento" deve estar no formato "YYYY-MM-DD".');
    }

    const pacientesAtuais = getTodosPacientes();
    if (pacientesAtuais.some(paciente => paciente.id === pacienteNovo.id)) {
      return res.status(400).send('Já existe um paciente com o mesmo "id".');
    }

    inserePaciente(pacienteNovo);
    res.status(201).send("Paciente cadastrado com sucesso.");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

function patchPaciente(req, res) {
  try {
    const id = req.params.id;
    if (id && Number(id)) {
      const body = req.body;
      modificaPaciente(body, id);
      res.send("Item modificado com sucesso");
    } else {
      res.status(422);
      res.send("Id inválido");
    }
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

function deletePaciente(req, res) {
  try {
    const id = req.params.id;
    if(id && Number(id)) {
      deletaPacientePorId(id)
      res.send("livro deletado com sucesso")
  } else {
      res.status(422)
      res.send("ID inválido")
  }
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}

module.exports = {
  getPacientes,
  getPaciente,
  postPaciente,
  patchPaciente,
  deletePaciente,
};
