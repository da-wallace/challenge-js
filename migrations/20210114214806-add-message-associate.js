'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Order belongsTo Customer
    return queryInterface.addColumn(
      'messages', // name of Source model
      'userId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // name of Target model
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
      'messages', // name of Source model
      'userId' // key we want to remove
    );
  }
};
