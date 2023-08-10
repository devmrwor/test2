import { Sequelize, DataTypes } from "sequelize";
import { Models } from "../common/enums/models";

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.NOTIFICATION,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      start_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date_time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      displaying_page: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      banner: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      banner_appearance: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      show_banner: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
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
