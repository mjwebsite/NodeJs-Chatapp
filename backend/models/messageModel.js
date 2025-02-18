'use strict';
const {
    Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of DataTypes lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Message.belongsTo(models.User, { foreignKey: 'senderId' });
            Message.belongsTo(models.Chat, { foreignKey: 'chatId' });
            Message.belongsToMany(models.User, {
                through: 'MessageReadBy',
                as: 'readByUsers',
                foreignKey: 'messageId',
            });
        }
    }
    Message.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        content: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    }, {
        sequelize,
        modelName: 'Message',
    });
    return Message;
};