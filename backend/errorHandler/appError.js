class AppError extends Error{
    constructor(data,statusCode){
        super(data.description);
        this.code = data.errorCode;
        this.statusCode=statusCode || 404;
        this.status = `${this.statusCode}`.startsWith(4) ? 'Error' : 'Warning';
        this.isOperational= data.type && data.type !="" ? true : false;
        this.type = data.type;

        Error.captureStackTrace(this, this.constructor)
    }
}
module.exports =AppError
