const healthService = require("../services/health");

const checkHealth = (req, res) => {
  const healthStatus = healthService.getHealthStatus();
  res.status(200).json(healthStatus);
};

module.exports = { checkHealth };
