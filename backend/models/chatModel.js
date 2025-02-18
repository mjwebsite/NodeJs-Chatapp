'use strict';
const {
    Model
} = require('sequelize');

const User = require('./user')

module.exports = (sequelize, DataTypes) => {
    class Chat extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of DataTypes lifecycle.
         * The `models/index` file will call this method automatically
         */
        static associate(models) {
            Chat.hasMany(models.Message, { foreignKey: 'chatId', as: 'messages' });
            Chat.belongsTo(models.User, { as: 'groupAdmin', foreignKey: 'groupAdminId' });
            Chat.belongsToMany(models.User, {
                through: 'ChatUsers', 
                as: 'users',
                foreignKey: 'chatId',
              });
        }
    }
    Chat.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        chatName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        participants: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: true,
        },
        isGroupChat: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        latestMessage: {
            type: DataTypes.STRING, // Assuming you are using INTEGER for IDs
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
        modelName: 'Chat',
    });


    return Chat;
};