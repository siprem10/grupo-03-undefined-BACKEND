'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          name: 'Administrator',
          description:
            'Puede cambiar de roles a los usuarios y puede banearlos. Ademas de poder usar la plataforma.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Premium-User',
          description:
            'Puede usar la plataforma como un usuario Standard, con algunos beneficios.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Standard-User',
          description: 'Puede usar la plataforma.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
