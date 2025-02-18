const AppError = require('./appError');

const sendErrorDev = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    res.status(statusCode).json({
        status,
        message,
        stack,
    });
};

const sendErrorProd = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    if (error.isOperational) {
        return res.status(statusCode).json({
            message,
            ...error,
        });
    }

    console.log(error.name, error.message, stack);
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong',
    });
};

const globalErrorHandler = (err, req, res, next) => {
    if (err && !err.type) {
        let message = err.errors && err.errors[0] && err.errors[0].message ? err.errors[0].message : err.message 
        if (err.name && message) {
            err = new AppError({
                "errorCode": err.name,
                "description": message,
                "type": "E"
            });
        }
    }
    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }
    sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
