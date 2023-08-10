import { Sequelize, DataTypes } from "sequelize";
import { Models } from "../common/enums/models";
import { Tables } from "../common/enums/tables";

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.EXPORT_DATA,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Tables.CATEGORY,
          key: "id",
        },
      },
      is_successful: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      count_of_rows: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
