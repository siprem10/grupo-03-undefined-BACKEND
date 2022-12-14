'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let user = await queryInterface.rawSelect('Users', {}, ['id']);

    if (!user) {
      user = 1;
    }

    const transactions = [];

  // if tiene categoria id es un egreso (pago servicio)
    for (let i = 0; i < 20; i++) {

      transactions.push({
        concept: faker.finance.transactionDescription(),
        amount: faker.finance.amount(),
        userId: faker.datatype.number({ min: user, max: user + 18 }),
        toUserId: null,
        categoryId: faker.datatype.number({ min: 1, max: 5 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
      });
    }

  // if tiene destino dif al usuario es un egreso (transferencia)
    for (let i = 0; i < 20; i++) {

      transactions.push({
        concept: faker.finance.transactionDescription(),
        amount: faker.finance.amount(),
        userId: faker.datatype.number({ min: user, max: user + 18 }),
        toUserId: faker.datatype.number({ min: user, max: user + 18 }),
        categoryId: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        deletedAt: null,
      });
    }

  // if tiene destino igual al usuario es un ingreso (carga saldo)
    for (let i = 0; i < 20; i++) {

      const idRepeat = faker.datatype.number({ min: user, max: user + 18 });

      transactions.push({
        concept: faker.finance.transactionDescription(),
        amount: faker.finance.amount(),
        userId: idRepeat,
        toUserId: idRepeat,
        categoryId: null,
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
