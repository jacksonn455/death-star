const { sign } = require("jsonwebtoken");
const jsonSecret = process.env.JSON_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

const generateToken = (payload) => {
  return sign(payload, jsonSecret, { expiresIn: "7d" });
};

const generateRefreshToken = (payload) => {
  return sign(payload, refreshSecret, { expiresIn: "15d" });
};

module.exports = {
  generateToken,
  generateRefreshToken,
};
