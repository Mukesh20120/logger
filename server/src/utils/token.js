const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, keys.ACCESS_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, keys.REFRESH_SECRET, { expiresIn: "7d" });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
