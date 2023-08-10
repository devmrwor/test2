import { Sequelize, DataTypes } from "sequelize";
import { Models } from "../common/enums/models";
import { Tables } from "../common/enums/tables";

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.PROFILE_RATING,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Tables.PROFILE,
          key: "id",
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      is_top_category: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      secure_deal_available: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      services_insured: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      top_executor: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      premium_executor: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      provides_volunteer_assistance: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      order_completed_on_time: {
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
