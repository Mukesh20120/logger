const jwt = require('jsonwebtoken')
const keys = require('../config/keys');

const generateNewToken = (payload)=>{
  return jwt.sign(payload,keys.JWT_SECRET );
}

module.exports = {generateNewToken};