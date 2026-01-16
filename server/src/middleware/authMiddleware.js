const jwt = require('jsonwebtoken');
const customError = require('../errors');
const keys = require('../config/keys');
const asyncWrapper = require('./asyncWrapper');

const authMiddleware = asyncWrapper((req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)throw new customError.UnAuthorizedError('Unauthenticated user');

    const token = authHeader.split(' ')[1];

    jwt.verify(token, keys.ACCESS_SECRET, function (err, decoded){
        if(err)throw new customError.UnAuthorizedError('Unauthorized access')
       
        req.userId = decoded.userId;
        next();
    })
});

module.exports = {authMiddleware};