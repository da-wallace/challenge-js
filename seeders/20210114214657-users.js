'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'demo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }
};
