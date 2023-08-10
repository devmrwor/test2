import { Sequelize, DataTypes } from "sequelize";
import { Models } from "../common/enums/models";
import { Tables } from "../common/enums/tables";

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.CATEGORY,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sort_order: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active_icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passive_icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Tables.CATEGORY,
          key: "id",
        },
      },
      meta_tags: {
        type: DataTypes.JSON,
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
