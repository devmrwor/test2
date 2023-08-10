'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OrderStatistics', 'deletedAt', {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('OrderStatistics', 'deletedAt');
  },
};
