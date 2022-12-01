'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transactions = [];

    // Create 20 transactions
    for (let i = 0; i < 20; i++) {
      transactions.push({
        id: faker.datatype.number({ max: 100 }),
        description: faker.finance.transactionDescription(),
        amount: faker.finance.amount(),
        userId: faker.datatype.number({ min: 1, max: 3 }),
        categoryId: 1,
        date: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
      });
    }

    await queryInterface.bulkInsert('transactitons', transactions, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all transactions
    await queryInterface.bulkDelete('transactitons', null, {});
  },
};
