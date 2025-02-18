
const controller = require("./controller");
const {findError} = require("./controller");
const AppError = require("../errorHandler/appError");
const bcrypt = require("bcryptjs");
const { generateToken } = require("./authentication");
const { Op } = require("sequelize");
const asyncHandler = require('express-async-handler');


let userFindOne = asyncHandler(async function (req, res, next) {
    if (req.body.email) {
        const email = req.body.email;
        let result = await controller.findOne("User", "email", email);
        if (!result || result.length <= 0) {
            let err = await controller.findError("InvalidEmail");
            return next(err);
        } else {
            res.send(result);
        }
    } else {
        let err = await controller.findError("EmailMandatory");
        return next(err);
    }
})

let userCreate = asyncHandler(async function (req, res, next) {
    if (req.body && Object.keys(req.body).length != 0) {
        const data1 = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        };
        let response = await controller.create("User", data1);
        if (!response || response.length <= 0) {
            let err = await controller.findError("CreationFailed");
            return next(err); 
        } else {
            req.body.userId = response.id;
            let profile = await controller.create("profile", req.body);
            res.send(profile);
        }
    } else {
        let err = await controller.findError("EmailMandatory")
        return next(err);
    }
})



let userAuthentication = asyncHandler(async function (req, res, next) {
    if (req.body.username && req.body.password) {
        var filter = req.body.username ? { where: { "username": { [Op.eq]: `${req.body.username}` } } } : null;
        let result = await controller.findOne("User", filter);
        if (!result || result.length <= 0 || !bcrypt.compareSync(req.body.password, result.password)) {
            let err = await controller.findError("InvalidCredentials");
            return next(err);
        } else {
            let token = generateToken({
                id: result.id,
            });

            if (token) {
                res.cookie("Authorization", token, {
                    secure: true,
                    httpOnly: true,
                });
            }

            return res.json({
                status: 'success',
                token,
                userId:result.id,
            });
        }
    } else {
        let err = await controller.findError("CredentialsMandatory");
        return next(err);
    }
})

const userProfileFindOne = asyncHandler(async function (req, res, next) {
    if (req.userId) {
        var filter = req.userId ? { where: { userId: { [Op.eq]: `${req.userId}` } } } : null;
        let result = await controller.findOne("profile", filter);
        if (!result || result.length <= 0) {
            let err = await controller.findError("InvalidEmail");
            return next(err);
        } else {
            res.send(result);
        }
    } else {
        let err = await controller.findError("EmailMandatory");
        return next(err);
    }
})

const createError = asyncHandler(async function (req, res, next) {
    if (req.body && Object.keys(req.body).length != 0) {
        let data = req.body
        req.userId ? data.createdBy = req.userId : null;
        let result = await controller.bulkcreate("Error", data);
        if (!result || result.length <= 0) {
            let err = await controller.findError("FailedToCreate");
            return next(err);
        } else {
            res.send(result);
        }
    } else {
        let err = await controller.findError("DetailsMandatory");
        return next(err);
    }
})


module.exports = {
    userFindOne: userFindOne,
    userCreate: userCreate,
    userAuthentication: userAuthentication,
    userProfileFindOne: userProfileFindOne,
    createError:createError,
}