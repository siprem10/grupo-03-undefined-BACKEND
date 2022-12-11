'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let user = await queryInterface.rawSelect('Users', {}, ['id']);

    if (!user) {
      user = 1;
    }

    const transactions = [];

    // Create 20 transactions
    for (let i = 0; i < 20; i++) {
      transactions.push({
        description: faker.finance.transactionDescription(),
        amount: faker.finance.amount(),
        userId: faker.datatype.number({ min: user, max: user + 18 }),
        categoryId: 1,
        date: faker.date.past(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
      });
    }

    await queryInterface.bulkInsert('Transactions', transactions, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all transactions
    await queryInterface.bulkDelete('Transactions', null, {});
  },
};
