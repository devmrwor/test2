import { Sequelize, Dialect } from "sequelize";
import config from "@config";
import registerModels from "../models";

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: config.dialect as Dialect,
  logging: false,
  dialectOptions: {
    // ssl: false,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

export const queryInterface = sequelize.getQueryInterface();
export const models = registerModels(sequelize);

export default sequelize;
