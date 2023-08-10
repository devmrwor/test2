'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE "Users" SET "email" = NULL WHERE "email" = 'none@example.com';`
    );
  },

  async down (queryInterface, Sequelize) {
    
  }
};
