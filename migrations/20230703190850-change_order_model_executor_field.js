'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`UPDATE "Orders" SET address = 'Default' WHERE address IS NULL`);
    await queryInterface.sequelize.query(`UPDATE "Orders" SET payment_method = 'cash' WHERE payment_method IS NULL`);

    await queryInterface.changeColumn('Orders', 'executor_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    });

    await queryInterface.changeColumn('Orders', 'profile_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Profiles',
        key: 'id',
      },
    });

    await queryInterface.changeColumn('Orders', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('Orders', 'address', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('Orders', 'payment_method', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Orders', 'executor_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    });

    await queryInterface.changeColumn('Orders', 'profile_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Profile',
        key: 'id',
      },
    });

    await queryInterface.changeColumn('Orders', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('Orders', 'address', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('Orders', 'payment_method', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
