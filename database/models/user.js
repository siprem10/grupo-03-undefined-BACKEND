'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'roleId' });
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false
    },
    creditCard: {
      type: DataTypes.STRING,
      allowNull: false
    },
    creditCardExp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.STRING
    },
  }, {
    paranoid: true,
    sequelize,
    timestamps: true,
    modelName: 'User',
  });
  return User;
};