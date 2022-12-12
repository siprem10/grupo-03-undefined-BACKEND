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
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  },
    {
      sequelize,
      timestamps: true,
      modelName: 'Category'
    });
  return Category;
};
