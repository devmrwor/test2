import { Sequelize, DataTypes } from 'sequelize';
import { Models } from '../common/enums/models';
import { Tables } from '../common/enums/tables';

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.FEEDBACK,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Tables.ORDER,
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Tables.USER,
          key: 'id',
        },
      },
      profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Tables.PROFILE,
          key: 'id',
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unproved: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
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
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
