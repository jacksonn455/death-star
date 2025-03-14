const express = require("express");
const mongoose = require("mongoose");
const { param } = require("express-validator");
const {
  getAllPlanners,
  getPlannerByIdService,
  createPlannerService,
  updatePlannerService,
  deletePlannerService,
} = require("../services/planner");
const {
  handleValidationErrors,
  validateId,
  validatePlannerData,
} = require("../utils/validationUtils");
const router = express.Router();

const validateIdMiddleware = [
  param("id")
    .custom((id) => {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID inválido.");
      }
      return true;
    })
    .withMessage("ID inválido."),
];

router.get("/", async (req, res, next) => {
  try {
    const { paciente, date, week, weeks, pageNumber } = req.query;
    const planners = await getAllPlanners({ paciente, date, week, weeks, pageNumber });
    res.json(planners);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
});

router.get(
  "/:id",
  validateIdMiddleware,
  async (req, res, next) => {
    try {
      const planner = await getPlannerByIdService(req.params.id);
      if (!planner)
        return res.status(404).json({ error: "Agendamento não encontrado." });
      res.json(planner);
    } catch (error) {
      console.error("Erro ao buscar agendamentos por id:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor" });
    }
  }
);

router.post(
  "/",
  validatePlannerData,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const newPlanner = await createPlannerService(req.body);
      res.status(201).json(newPlanner);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  [validateId, validatePlannerData],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const updatedPlanner = await updatePlannerService(
        req.params.id,
        req.body
      );
      res.json(updatedPlanner);
    } catch (error) {
      const errorMessage = error.message || "Erro interno do servidor";
      res.status(500).json({ error: errorMessage });
    }
  }
);

router.delete(
  "/:id",
  validateIdMiddleware,
  async (req, res, next) => {
    try {
      await deletePlannerService(req.params.id);
      res.status(204).end();
    } catch (error) {
      const errorMessage = error.message || "Erro interno do servidor";
      res.status(500).json({ error: errorMessage });
    }
  }
);

module.exports = router;
