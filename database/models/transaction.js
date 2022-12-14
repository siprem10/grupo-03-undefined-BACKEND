'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    // Associations
    static associate(models) {
      Transaction.belongsTo(models.User, { as: "user", foreignKey: 'userId' });
      Transaction.belongsTo(models.User, { as: "toUser", foreignKey: 'toUserId' });
      Transaction.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  // Model definition
  Transaction.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM(["Ingreso", "Egreso"]),
      },
      concept: {
        type: DataTypes.STRING,
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      toUserId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      categoryId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
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
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Transaction',
    }
  );
  return Transaction;
};
