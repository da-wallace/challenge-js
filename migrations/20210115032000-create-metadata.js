'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('metadata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      icon: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      keywords: {
        type: Sequelize.STRING
      },
      provider: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('metadata');
  }
};
