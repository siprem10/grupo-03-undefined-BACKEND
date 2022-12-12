'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      {
        type: 'Ingreso de dinero',
        createdAt: new Date()
      },
      {
        type: 'Egreso de dinero',
        createdAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('Categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
