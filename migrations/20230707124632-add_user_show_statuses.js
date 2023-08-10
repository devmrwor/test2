'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'show_orders', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Users', 'show_feedbacks', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Users', 'show_company_feedbacks', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Users', 'show_messengers', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Users', 'show_waiting_for_review', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'show_orders');
    await queryInterface.removeColumn('Users', 'show_waiting_for_review');
    await queryInterface.removeColumn('Users', 'show_messengers');
    await queryInterface.removeColumn('Users', 'show_company_feedbacks');
    await queryInterface.removeColumn('Users', 'show_feedbacks');
  },
};
