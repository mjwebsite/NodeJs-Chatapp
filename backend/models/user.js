'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcryptjs");
const AppError = require("../errorHandler/appError");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.profile, {
        foreignKey: 'userId',
      })
      this.belongsToMany(models.Chat, {
        through: 'ChatUsers', // The join table for this many-to-many relationship
        as: 'chats',
        foreignKey: 'userId',
      });
      
      // One-to-many relationship: User has many Messages (sent messages)
      this.hasMany(models.Message, {
        foreignKey: 'senderId', // foreign key in Message model
        as: 'messages', // Alias for this relationship
      });
      
      // Many-to-many relationship between User and Message (for readBy users)
      this.belongsToMany(models.Message, {
        through: 'MessageReadBy',
        as: 'readMessages',
        foreignKey: 'userId', // user who read the message
      })
    }
  }
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username cannot be null',
        },
        notEmpty: {
          msg: 'Username cannot be empty',
        },
        len: [5, 10],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'email cannot be null',
        },
        notEmpty: {
          msg: 'email cannot be empty',
        },
        isEmail: {
          msg: 'Invalid email id',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password cannot be null',
        },
        notEmpty: {
          msg: 'password cannot be empty',
        },
      },
      set(value) {
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/.test(
            value
          )
        ) {
          throw new AppError({
            "errorCode": "Password_Invalid_1",
            "description": 'The password must contain atleast 8 characters including at least 1 uppercase, 1 lowercase and one digit.',
            "type": "E"
          });
        }
        if (value && value.trim() != "") {
          let salt = bcrypt.genSaltSync(8);
          let hashPassword = bcrypt.hashSync(value, salt);
          this.setDataValue('password', hashPassword);
        } else {
          throw new AppError({
            "errorCode": "Password_Invalid_2",
            "description": 'Password and confirm password must be the same',
            "type": "E"
          });
        }
      },
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Customer"
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    paranoid: true,
    freezeTableName: true,
    modelName: 'User',
  });
  return User;
};