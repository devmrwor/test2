'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });

    await queryInterface.changeColumn('Users', 'facebook_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });
    await queryInterface.changeColumn('Users', 'google_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });

    await queryInterface.changeColumn('Users', 'telegram_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    await queryInterface.changeColumn('Users', 'facebook_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    await queryInterface.changeColumn('Users', 'google_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    await queryInterface.changeColumn('Users', 'telegram_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
  }
};
