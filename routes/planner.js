const express = require("express");
const {
  getAllPlanners,
  getPlannerByIdService,
  createPlannerService,
  updatePlannerService,
  deletePlannerService,
} = require("../services/planner");

const router = express.Router();
const { body, param, validationResult } = require('express-validator');

const validatePlannerData = [
  body('date').isString().withMessage('Data inválida'),
  body('time').isString().withMessage('Hora inválida'),
  body('paciente').isString().notEmpty().withMessage('Paciente é obrigatório'),
];

const validateId = [
  param('id').isMongoId().withMessage('ID inválido')
];

router.get("/", async (req, res) => {
  try {
    const { paciente, date, week } = req.query;
    const planners = await getAllPlanners({ paciente, date, week });
    res.json(planners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", validateId, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const planner = await getPlannerByIdService(req.params.id);
    if (!planner) return res.status(404).json({ error: "Agendamento não encontrado." });
    res.json(planner);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", [validateId, validatePlannerData], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedPlanner = await updatePlannerService(req.params.id, req.body);
    res.json(updatedPlanner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deletePlannerService(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;