'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Profiles', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Profiles', 'remote_address', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Profiles', 'company_logo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Profiles', 'additional_emails', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Profiles', 'company_logo');
    await queryInterface.removeColumn('Profiles', 'phone');
    await queryInterface.removeColumn('Profiles', 'remote_address');
    await queryInterface.removeColumn('Profiles', 'additional_emails');
  },
};
