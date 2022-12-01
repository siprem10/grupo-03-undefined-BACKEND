'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    // Associations
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'userId' });
      Transaction.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  // Model definition
  Transaction.init(
    {
      id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      deletedAt: DataTypes.STRING
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Transaction'
    }
  );
  return Transaction;
};
