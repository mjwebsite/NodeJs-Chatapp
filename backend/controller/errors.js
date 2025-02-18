

const controller = require("./controller.js");
const User = require("../models/user.js");
const { Op } = require("sequelize");
const AppError = require('../errorHandler/appError.js');
const asyncHandler = require('express-async-handler')

let statusType = {
    "E": 404,
    "M": 401,
    "U": 401,
    "W": 400
}
const getErrorDescription = asyncHandler(async (errorcode) => {
    let filter = { where: { "errorCode": { [Op.eq]: `${errorcode}` } } };
    let error = await User.findOne("Error", filter);
    let statusCode = statusType[error.type] ? statusType[error.type] : 404
    let err = new AppError(error.errorCode, error.description, statusCode, error.type);
    return (err);
})

module.exports = getErrorDescription