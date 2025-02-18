
const db = require("../models");
const { User, Chat, Message , profile} = require('../models'); 
// const Op = db.Sequelize.Op;
const { Op } = require("sequelize");
const AppError = require("../errorHandler/appError");
const errors = require("../errorHandler/errors");


let statusType = {
    "E": 404,
    "M": 401,
    "U": 401,
    "W": 400
}

module.exports = {
    
    findChat: (userId1, userId2) => {
        return new Promise((resolve, reject) => {
            // Find the chat where `isGroupChat` is false, and it contains both users (req.user._id and userId)
            db["Chat"].findOne({
                where: {
                    isGroupChat: false,
                    participants: {[Op.contains]: [userId1, userId2]}
                },
                include: [
                    {
                      model: User,
                      as: 'users', // Alias for the associated users
                      attributes: ['id'], // Include specific fields
                      include:[{ model:profile }]
                    },
                    {
                        model: Message,
                        as: 'messages', // Alias for messages
                      order: [['createdAt', 'ASC']], // Ensure messages are ordered by creation date
                    },
                  ],
            }).then(data => {
                resolve(data);
            })
                .catch(err => {
                    reject(err);
                });

        })

    },
    findError: (errorCode, statusCode) => {
        return new Promise((resolve, reject) => {
            try {
                let filter = { where: { "errorCode": { [Op.eq]: `${errorCode}` } } };
                db["Error"].findOne(filter)
                    .then(data => {
                        let statusCode = statusType[data.dataValues.type] ? statusType[data.dataValues.type] : 404
                        let error = new AppError(data.dataValues, statusCode)
                        resolve(error);
                    })
                    .catch(err => {
                        reject(err);
                    });
            } catch (error) {
                reject(error);
            }
        })
    },
    findOne: (model, filter) => {
        return new Promise((resolve, reject) => {
            db[model].findOne(filter)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    create: (model, userdata) => {
        return new Promise((resolve, reject) => {
            db[model].create(userdata)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    bulkcreate: (model, userdata) => {
        return new Promise((resolve, reject) => {
            db[model].bulkCreate(userdata)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    findOneByID: (model, id) => {
        return new Promise((resolve, reject) => {
            db[model].findByPk(id)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    findAll: (model, filter) => {
        return new Promise((resolve, reject) => {
            db[model].findAndCountAll(filter)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    findAllOnly: (model, filter) => {
        return new Promise((resolve, reject) => {
            db[model].findAll(filter)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    findCart: (model, filter) => {
        return new Promise((resolve, reject) => {
            db[model].findAndCountAll(filter)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        })
    },

    delete: (model, filter) => {
        return new Promise((resolve, reject) => {
            db[model].destroy(filter)
                .then(num => {
                    if (num == 1) {
                        resolve("success");
                    } else {
                        reject(new AppError(`Cannot delete record with id=. Expected data was not found!`, 404))
                    }
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
    update: (model, data, filter) => {
        return new Promise((resolve, reject) => {
            db[model].update(data, filter)
                .then(num => {
                    if (num == 1) {
                        resolve("success");
                    } else {
                        reject(new AppError(`Cannot find record with id=. Expected data was not found!`, 404))
                    }
                })
                .catch(err => {
                    reject(err);
                });
        })
    },
}

