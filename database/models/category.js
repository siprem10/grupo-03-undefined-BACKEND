'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    // Associations
    static associate(models) {
      Category.hasMany(models.Transaction, { foreignKey: 'categoryId' });
    }
  }
  // Model definition
  Category.init({
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    deletedAt: {
      type: Sequelize.DATE
    }
  },
    {
      sequelize,
      timestamps: true,
      modelName: 'Category'
    });
  return Category;
};
