const express = require("express");
const {
  getAllPlanners,
  getPlannerByIdService,
  createPlannerService,
  updatePlannerService,
  deletePlannerService,
} = require("../services/planner");

const { body, param, validationResult } = require("express-validator");
const router = express.Router();

const validatePlannerData = [
  body("date").isString().withMessage("Data inválida"),
  body("time").isString().withMessage("Hora inválida"),
  body("paciente").isString().notEmpty().withMessage("Paciente é obrigatório"),
];

const validateId = [param("id").isMongoId().withMessage("ID inválido")];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/", async (req, res) => {
  try {
    const { paciente, date, week } = req.query;
    const planners = await getAllPlanners({ paciente, date, week });
    res.json(planners);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

router.get("/:id", validateId, handleValidationErrors, async (req, res) => {
  try {
    const planner = await getPlannerByIdService(req.params.id);
    if (!planner) return res.status(404).json({ error: "Agendamento não encontrado." });
    res.json(planner);
  } catch (error) {
    console.error("Erro ao buscar agendamento por ID:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

router.post("/", validatePlannerData, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newPlanner = await createPlannerService(req.body);
    res.status(201).json(newPlanner);
  } catch (error) {
    console.error("Erro ao criar agendamento:", error.message);

    if (error.message.includes("Já existe um agendamento")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Erro interno no servidor." });
  }
});


router.put("/:id", [validateId, validatePlannerData], handleValidationErrors, async (req, res) => {
  try {
    const updatedPlanner = await updatePlannerService(req.params.id, req.body);
    res.json(updatedPlanner);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

router.delete("/:id", validateId, handleValidationErrors, async (req, res) => {
  try {
    await deletePlannerService(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

module.exports = router;