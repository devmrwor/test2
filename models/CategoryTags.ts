import { Sequelize, DataTypes } from "sequelize";
import { Models } from "../common/enums/models";
import { Tables } from "../common/enums/tables";

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.CATEGORY_TAGS,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      language: {
        type: DataTypes.STRING,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Tables.CATEGORY,
          key: "id",
        },
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
