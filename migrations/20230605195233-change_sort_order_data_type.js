'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // First, you have to create a new column with the correct type
      await queryInterface.addColumn('Categories', 'temp_column', Sequelize.STRING, { transaction });

      // Then you have to copy the data from the old column to the new one
      await queryInterface.sequelize.query('UPDATE "Categories" SET temp_column = CAST(sort_order AS VARCHAR)', {
        transaction,
      });

      // Next, you have to remove the old column
      await queryInterface.removeColumn('Categories', 'sort_order', { transaction });

      // Finally, you have to rename the temporary column to the old column name
      await queryInterface.renameColumn('Categories', 'temp_column', 'sort_order', { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // If you want to rollback, you need to reverse the process
      await queryInterface.addColumn('Categories', 'temp_column', Sequelize.INTEGER, { transaction });
      await queryInterface.sequelize.query('UPDATE "Categories" SET temp_column = CAST(sort_order AS INTEGER)', {
        transaction,
      });
      await queryInterface.removeColumn('Categories', 'sort_order', { transaction });
      await queryInterface.renameColumn('Categories', 'temp_column', 'sort_order', { transaction });
    });
  },
};
