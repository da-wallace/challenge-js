'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Order belongsTo Customer
    return queryInterface.addColumn(
      'metadata', // name of Source model
      'messageId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'messages', // name of Target model
          key: 'id' // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    // remove Order belongsTo Customer
    return queryInterface.removeColumn(
      'metadata', // name of Source model
      'messageId' // key we want to remove
    );
  }
};
