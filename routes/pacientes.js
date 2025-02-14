const express = require("express");
const {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente,
} = require("../controllers/pacientes");
const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const router = express.Router();

router.use(express.json());

const validatePacienteData = [
  body("nome")
    .isString()
    .notEmpty()
    .withMessage("Nome do paciente é obrigatório"),
  body("idade")
    .isInt({ min: 0 })
    .withMessage("Idade deve ser um número inteiro maior ou igual a 0"),
  body("genero").isString().notEmpty().withMessage("Gênero é obrigatório"),
  body("telefone").isString().notEmpty().withMessage("Telefone é obrigatório"),
  body("email").isEmail().withMessage("Email deve ser válido"),
  body("dataNascimento")
    .isDate()
    .withMessage("Data de nascimento deve ser válida"),
  body("tabagista")
    .isBoolean()
    .withMessage("Campo 'tabagista' deve ser um valor booleano"),
  body("alcool")
    .isBoolean()
    .withMessage("Campo 'alcool' deve ser um valor booleano"),
  body("covid")
    .isBoolean()
    .withMessage("Campo 'covid' deve ser um valor booleano"),
  body("suplementacao")
    .isString()
    .notEmpty()
    .withMessage("Suplementação é obrigatória"),
  body("refeicoes")
    .isString()
    .notEmpty()
    .withMessage("Refeições são obrigatórias"),
  body("carne")
    .isString()
    .notEmpty()
    .withMessage("Tipo de carne é obrigatório"),
  body("lanches").isString().notEmpty().withMessage("Lanches são obrigatórios"),
  body("refrigerante")
    .isString()
    .notEmpty()
    .withMessage("Refrigerante é obrigatório"),
  body("frutas").isString().notEmpty().withMessage("Frutas são obrigatórias"),
  body("leite").isString().notEmpty().withMessage("Leite é obrigatório"),
  body("madrugada")
    .isString()
    .notEmpty()
    .withMessage("Madrugada é obrigatório"),
];

const validateId = [param("id").isMongoId().withMessage("ID inválido")];

router.get("/", async (req, res) => {
  try {
    const { nome, genero, idade } = req.query;
    const pacientes = await getPacientes({ nome, genero, idade });
    res.status(200).json(pacientes);
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", validateId, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const paciente = await getPacienteById(req.params.id);
    if (!paciente) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }
    res.status(200).json(paciente);
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", validatePacienteData, async (req, res) => {
    try {
      const newPaciente = await createPaciente(req, res);
      res.status(201).json(newPaciente);
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      res.status(500).json({ error: error.message });
    }
  });

router.put("/:id", [validateId, validatePacienteData], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedPaciente = await updatePaciente(req.params.id, req.body);
    if (!updatedPaciente) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }
    res.status(200).json(updatedPaciente);
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", validateId, async (req, res) => {
  try {
    const deletedPaciente = await deletePaciente(req.params.id);
    if (!deletedPaciente) {
      return res.status(404).json({ error: "Paciente não encontrado." });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Erro ao excluir paciente:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;