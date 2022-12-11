'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      {
        name: 'Incomes',
        description: 'Ingreso de dinero',
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
      },
      {
        name: 'Outcomes',
        description: 'Egreso de dinero',
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
      },
    ];

    await queryInterface.bulkInsert('Categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
