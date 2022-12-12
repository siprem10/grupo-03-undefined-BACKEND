'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let user = await queryInterface.rawSelect('Users', {}, ['id']);

    if (!user) {
      user = 1;
    }

    const transactions = [];
    let toggle = true;

    // Create 20 transactions
    for (let i = 0; i < 20; i++) {
      toggle = !toggle;
      transactions.push({
        concept: faker.finance.transactionDescription(),
        amount: faker.finance.amount(),
        userId: faker.datatype.number({ min: user, max: user + 18 }),
        toUserId: toggle ? (faker.datatype.number({ min: user, max: user + 18 })) : null,
        categoryId: 1,
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
