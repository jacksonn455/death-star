const {
    getAllPlanners,
    getPlannerByIdService,
    createPlannerService,
    updatePlannerService,
    deletePlannerService,
  } = require("../services/planner");
  
  async function getPlanners(req, res) {
    try {
      const { paciente, date } = req.query;
      const planners = await getAllPlanners({ paciente, date });
      if (!res.headersSent) {
        return res.status(200).send(planners);
      }
    } catch (error) {
      console.error("Erro ao buscar planners:", error);
      if (!res.headersSent) {
        return res.status(500).send(error.message);
      }
    }
  }
  
  
  async function getPlannerById(req, res) {
    try {
      const id = req.params.id;
      if (id && Number(id)) {
        const planner = await getPlannerByIdService(id);
        res.status(200).send(planner);
      } else {
        res.status(422).send("ID inválido");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  
  async function createPlanner(req, res) {
    try {
      const plannerData = req.body;
      const requiredFields = ["date", "time", "service", "paciente", "responsible"];
  
      for (const field of requiredFields) {
        if (!plannerData[field]) {
          return res.status(400).send(`O campo "${field}" é obrigatório.`);
        }
      }
  
      const newPlanner = await createPlannerService(plannerData);
      res.status(201).send(newPlanner);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  
  async function updatePlanner(req, res) {
    try {
      const id = req.params.id;
      const updatedData = req.body;
  
      if (id && Number(id)) {
        const updatedPlanner = await updatePlannerService(id, updatedData);
        res.status(200).send(updatedPlanner);
      } else {
        res.status(422).send("ID inválido");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  
  async function deletePlanner(req, res) {
    try {
      const id = req.params.id;
  
      if (id && Number(id)) {
        await deletePlannerService(id);
        res.status(200).send("Agendamento excluído com sucesso.");
      } else {
        res.status(422).send("ID inválido");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  
  module.exports = {
    getPlanners,
    getPlannerById,
    createPlanner,
    updatePlanner,
    deletePlanner,
  };
  