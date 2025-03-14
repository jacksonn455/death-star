const {
  getAllPlanners,
  getPlannerByIdService,
  createPlannerService,
  updatePlannerService,
  deletePlannerService,
} = require("../services/planner");

const {
  validateId,
  validateRequiredFields,
} = require("../utils/validationUtils");

async function getPlanners(req, res, next) {
  try {
    const { paciente, date, week, weeks, pageNumber, nextAppointments } = req.query;
    const planners = await getAllPlanners({ paciente, date, week, weeks, pageNumber, nextAppointments });
    res.status(200).send(planners);
  } catch (error) {
    next(error);
  }
}

async function getPlannerById(req, res, next) {
  try {
    validateId(String(req.params.id));
    const planner = await getPlannerByIdService(req.params.id);
    res.status(200).send(planner);
  } catch (error) {
    next(error);
  }
}

async function createPlanner(req, res, next) {
  try {
    const requiredFields = [
      "date",
      "time",
      "service",
      "paciente",
      "responsible",
    ];
    validateRequiredFields(req.body, requiredFields);

    const newPlanner = await createPlannerService(req.body);
    res.status(201).send(newPlanner);
  } catch (error) {
    next(error);
  }
}

async function updatePlanner(req, res, next) {
  try {
    validateId(String(req.params.id));
    const updatedPlanner = await updatePlannerService(req.params.id, req.body);
    res.status(200).send(updatedPlanner);
  } catch (error) {
    next(error);
  }
}

async function deletePlanner(req, res, next) {
  try {
    validateId(String(req.params.id));
    await deletePlannerService(req.params.id);
    res.status(200).send("Agendamento excluído com sucesso.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPlanners,
  getPlannerById,
  createPlanner,
  updatePlanner,
  deletePlanner,
};
