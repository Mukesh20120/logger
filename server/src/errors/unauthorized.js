const CustomApiError = require('./custom-api');
const {StatusCodes} = require('http-status-codes')

class UnAuthorizedError extends CustomApiError{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = UnAuthorizedError;