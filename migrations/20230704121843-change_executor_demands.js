'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`UPDATE "Orders" SET "address" = 'Default' WHERE "address" IS NULL`);
    await queryInterface.sequelize.query(
      `UPDATE "Orders" SET "payment_method" = 'cash' WHERE "payment_method" IS NULL`
    );
    await queryInterface.sequelize.query(`ALTER TABLE "Orders" ALTER COLUMN "executor_id" DROP NOT NULL`);
    await queryInterface.sequelize.query(`ALTER TABLE "Orders" ALTER COLUMN "profile_id" DROP NOT NULL`);
    await queryInterface.sequelize.query(`ALTER TABLE "Orders" ALTER COLUMN "description" DROP NOT NULL`);
    await queryInterface.sequelize.query(`ALTER TABLE "Orders" ALTER COLUMN "address" SET NOT NULL`);
    await queryInterface.sequelize.query(`ALTER TABLE "Orders" ALTER COLUMN "payment_method" SET NOT NULL`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TABLE "Orders" ALTER COLUMN "executor_id" SET NOT NULL`);
    await queryInterface.sequelize.query(`ALTER TABLE "Orders" ALTER COLUMN "profile_id" SET NOT NULL`);
    await queryInterface.sequelize.query(`ALTER TABLE "Orders" ALTER COLUMN "description" SET NOT NULL`);
    await queryInterface.sequelize.query(`ALTER TABLE "Orders" ALTER COLUMN "address" DROP NOT NULL`);
    await queryInterface.sequelize.query(`ALTER TABLE "Orders" ALTER COLUMN "payment_method" DROP NOT NULL`);
  },
};
