'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Error extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
    }
  }
  Error.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    errorCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'error code cannot be null',
        },
        notEmpty: {
          msg: 'error code cannot be empty',
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'description cannot be null',
        },
        notEmpty: {
          msg: 'description cannot be empty',
        },
      },
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "English"
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "E"
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Admin"
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
    modelName: 'Error',
  });
  return Error;
};