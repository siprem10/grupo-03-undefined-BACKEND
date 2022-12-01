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
  Category.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      deletedAt: {
        type: DataTypes.DATE
      },
      active: DataTypes.BOOLEAN
    },
    {
      sequelize,
      timestamps: true,
      modelName: 'Category'
    }
  );
  return Category;
};
