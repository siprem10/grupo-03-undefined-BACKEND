'use strict';
const { faker } = require('@faker-js/faker');
const { hash } = require('bcrypt');
const { getExpiringDate, getCardNum } = require('../../utils/creditCard');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const standardUsers = [
      {
        firstName: 'Alberto',
        lastName: 'Gomez',
        email: 'gomez.juan.12@gmail.com',
        password: await hash('alberto123', 10),
        avatar: faker.image.avatar(),
        roleId: 1,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Luciano',
        lastName: 'Piñol',
        email: 'luchemma@gmail.com',
        password: await hash('luciano123', 10),
        avatar: faker.image.avatar(),
        roleId: 2,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Ramiro',
        lastName: 'Dominguez',
        email: 'e@gmail.com',
        password: await hash('12345678', 10),
        avatar: faker.image.avatar(),
        roleId: 1,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Alkybank',
        lastName: 'Wallet',
        email: 'admin@gmail.com',
        password: await hash('admin', 10),
        avatar: faker.image.avatar(),
        roleId: 1,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Lio',
        lastName: 'Messi',
        email: 'e2@gmail.com',
        password: await hash('12345678', 10),
        avatar: faker.image.avatar(),
        roleId: 1,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Franco',
        lastName: `D'Angelo`,
        email: 'ffrancodangelo@gmail.com',
        password: await hash('franco123', 10),
        avatar: faker.image.avatar(),
        roleId: 2,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Alejandro',
        lastName: 'Gonzalez',
        email: 'alegb91@gmail.com',
        password: await hash('alejandro123', 10),
        avatar: faker.image.avatar(),
        roleId: 2,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Joaquin',
        lastName: 'Franco',
        email: 'joafran0016@gmail.com',
        password: await hash('joaquin123', 10),
        avatar: faker.image.avatar(),
        roleId: 2,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
    ];

    for (let i = 0; i < 4; i++) {
      const nameUser = faker.name.firstName();

      const newStandardUser = {
        firstName: nameUser,
        lastName: faker.name.lastName(),
        password: await hash(`${nameUser}123`.toLowerCase(), 10),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        roleId: 2,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      };
      standardUsers.push(newStandardUser);
    }

    const regularUsers = [];

    for (let i = 0; i < 10; i++) {
      const newRegularUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: await hash(faker.internet.password(), 10),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        roleId: 2,
        creditCard: getCardNum(),
        creditCardExp: getExpiringDate(new Date()),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      };
      regularUsers.push(newRegularUser);
    }

    const allUsers = [...standardUsers, ...regularUsers];
    await queryInterface.bulkInsert('Users', allUsers, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
