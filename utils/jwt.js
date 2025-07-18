const { sign, verify } = require("jsonwebtoken");
const jsonSecret = process.env.JSON_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

const generateToken = (payload) => {
  return sign(payload, jsonSecret, { expiresIn: "7d" });
};

const generateRefreshToken = (payload) => {
  return sign(payload, refreshSecret, { expiresIn: "15d" });
};

const verifyRefreshToken = (token) => {
  try {
    return verify(token, refreshSecret);
  } catch (error) {
    throw error;
  }
};

const verifyAccessToken = (token) => {
  try {
    return verify(token, jsonSecret);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
};
