'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Use Sequelize.Op to get the not equal operator
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete('Users', {
      deletedAt: {
        [Op.ne]: null
      }
    }, {});
  },

  down: async (queryInterface, Sequelize) => {
    /*
     * There's no reliable way to revert this migration since we're deleting data.
     * The down function is therefore left intentionally blank.
     */
  }
};

