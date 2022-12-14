'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const categories = [
      { name: 'Internet', createdAt: new Date() },
      { name: 'Agua', createdAt: new Date()  },
      { name: 'Luz', createdAt: new Date()  },
      { name: 'Gas', createdAt: new Date()  },
      { name: 'Celular', createdAt: new Date()  },
    ];

    await queryInterface.bulkInsert('Categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
