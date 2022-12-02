'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const standardUsers = [
      {
        firstName: 'Alberto',
        lastName: 'Gomez',
        email: 'gomez.juan.12@gmail.com',
        password: 'alberto123',
        avatar: faker.image.avatar(),
        roleId: 1,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Luciano',
        lastName: 'Piñol',
        email: 'luchemma@gmail.com',
        password: 'luciano123',
        avatar: faker.image.avatar(),
        roleId: 1,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Ramiro',
        lastName: 'Dominguez',
        email: 'ramidomgz@gmail.com',
        password: 'ramiro123',
        avatar: faker.image.avatar(),
        roleId: 1,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Franco',
        lastName: `D'Angelo`,
        email: 'ffrancodangelo@gmail.com',
        password: 'franco123',
        avatar: faker.image.avatar(),
        roleId: 1,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Alejandro',
        lastName: 'Gonzalez',
        email: 'alegb91@gmail.com',
        password: 'alejandro123',
        avatar: faker.image.avatar(),
        roleId: 1,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
      {
        firstName: 'Joaquin',
        lastName: 'Franco',
        email: 'joafran0016@gmail.com',
        password: 'joaquin123',
        avatar: faker.image.avatar(),
        roleId: 1,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      },
    ];

    for (let i = 0; i < 4; i++) {
      const nameUser = faker.name.firstName();

      const newStandardUser = {
        firstName: nameUser,
        lastName: faker.name.lastName(),
        password: `${nameUser}123`.toLowerCase(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        roleId: 1,
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
        password: faker.internet.password(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        roleId: 2,
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