'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_group', {
      userId: {
        type: Sequelize.UUID
      },
      groupId: {
        type: Sequelize.UUID
      },
    }, {
      timestamps: false,
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_group');
  }
};
