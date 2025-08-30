'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profile_image: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,

      defaultScope: {
        attributes: { exclude: ['password', 'refreshToken'] }, // 🚀 hides password in queries
      },
      scopes: {
        withPassword: { attributes: {} }, // return all fields including password
        withAll: { attributes: { exclude: [] } }, // 🚀 include everything
      },
    }
  );

  // 👇 Define hidden fields like Laravel
  User.hidden = ['password', 'refreshToken'];

  // 👇 Override toJSON to remove hidden fields
  User.prototype.toJSON = function () {
    const values = { ...this.get() };

    User.hidden.forEach((field) => {
      delete values[field];
    });

    return values;
  };

  return User;
};
