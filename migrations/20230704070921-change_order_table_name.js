'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('OrderStatistic', 'OrderStatistics');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('OrderStatistics', 'OrderStatistic');
  },
};
