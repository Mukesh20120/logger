const {StatusCodes} = require('http-status-codes');
const { logger } = require('../utils/log');
const errorHandlerMiddleware = (err,req,res,next)=>{

    let customError = {
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "something went wrong"
    }
    if(err.name === 'ValidationError'){
        customError.message = Objectj.values(err.errors).map((item)=>item.message).join(',');
        customError.statusCode = 400;
    }

    if(err.code && err.code === 11000){
        customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} fields, choose another value`;
        customError.statusCode = 400;
    }

    if(err.name === 'CastError'){
        customError.message = `No item is found with id ${err.value}`;
        customError.statusCode = 404;
    }

    logger.error('Unhandlede error', {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl
    });

return res.status(customError.statusCode).json({message: customError.message});
}

module.exports = errorHandlerMiddleware;