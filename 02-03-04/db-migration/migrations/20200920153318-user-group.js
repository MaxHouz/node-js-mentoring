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

    await queryInterface.sequelize.query('ALTER TABLE user_group ADD CONSTRAINT  fk_userId FOREIGN KEY ("userId") REFERENCES users ("id") ON DELETE CASCADE;')
    await queryInterface.sequelize.query('ALTER TABLE user_group ADD CONSTRAINT  fk_groupId FOREIGN KEY ("groupId") REFERENCES groups ("id") ON DELETE CASCADE;')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_group');
  }
};
