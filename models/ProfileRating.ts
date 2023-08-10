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

      passport_photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      photo_with_documents: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      confirm_photo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_top_in_category: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_top_in_subcategory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
