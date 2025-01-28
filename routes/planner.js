const express = require("express");
const {
  getAllPlanners,
  getPlannerByIdService,
  createPlannerService,
  updatePlannerService,
  deletePlannerService,
} = require("../services/planner");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const planners = await getAllPlanners();
    res.json(planners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const planner = await getPlannerByIdService(req.params.id);
    if (!planner) return res.status(404).json({ error: "Agendamento não encontrado." });
    res.json(planner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newPlanner = await createPlannerService(req.body);
    res.status(201).json(newPlanner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPlanner = await updatePlannerService(req.params.id, req.body);
    res.json(updatedPlanner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deletePlannerService(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;