'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'price_to', {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'photos', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'status_date', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'address', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'type', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'place', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'date', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'payment_method', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'price_to');
    await queryInterface.removeColumn('Orders', 'photos');
    await queryInterface.removeColumn('Orders', 'status_date');
    await queryInterface.removeColumn('Orders', 'name');
    await queryInterface.removeColumn('Orders', 'address');
    await queryInterface.removeColumn('Orders', 'type');
    await queryInterface.removeColumn('Orders', 'place');
    await queryInterface.removeColumn('Orders', 'date');
    await queryInterface.removeColumn('Orders', 'payment_method');
  },
};
