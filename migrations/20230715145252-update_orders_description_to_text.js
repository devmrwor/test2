'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Orders', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.changeColumn('Orders', 'cancel_comment', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Orders', 'description', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('Orders', 'cancel_comment', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};

