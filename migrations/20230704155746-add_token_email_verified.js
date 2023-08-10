'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'is_email_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('Users', 'email_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`UPDATE "Users" SET "is_email_verified" = TRUE;`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'is_email_verified');
    await queryInterface.removeColumn('Users', 'email_token');
  },
};
