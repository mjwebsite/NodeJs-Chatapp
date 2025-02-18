
const jwt = require('jsonwebtoken');
const AppError = require('../errorHandler/appError');
const errors = require("../errorHandler/errors");
const controller = require('./controller');

module.exports = {

    generateToken: (payload) => {
        try {
            let secret = process.env.JWT_SECRET_KEY || "sdfghdshsdfhdfhndfhd";
            return jwt.sign(payload, secret, {
                expiresIn: 60 * 60,
            });
        } catch (error) {
            throw error;
        }
    },

    authenticate: async(req, res, next) => {
        try {
            let tocken
            if (req && req.headers.authorization) tocken = req.headers.authorization;
            else tocken = req && req.cookie && req.cookie.authenticate ? req.cookie.authenticate : undefined;
            let validate = false;
            if (process.env.SSO_VALIDATE === "true") {
                validate = true
            }
            if (req && req.originalUrl == "/api/user/login") {
                if (tocken) {
                    res.cookie("Authorization", tocken);
                    return res.json({
                        status: 'success',
                        tocken,
                    });
                } else next();
            }
            else {
                if (tocken) {
                    var error=[];
                    let secret = process.env.JWT_SECRET_KEY || "sdfghdshsdfhdfhndfhd";
                    jwt.verify(tocken, secret, function (err, decoded) {
                        if (err && validate) {
                            next(err)
                        }
                        else {
                            req.userId = decoded && decoded.id ? decoded.id : null;
                        }
                    });
                    next()
                }
                else if (!validate) next();
                else {
                    let err = await controller.findError("JsonWebTokenError");
                    return next(err);
                }
            }
        } catch (error) {
            throw error;
        }
    }
}