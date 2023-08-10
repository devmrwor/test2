import { Sequelize, DataTypes } from 'sequelize';
import { Models } from '../common/enums/models';
import { Tables } from '../common/enums/tables';

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.ORDER,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Tables.USER,
          key: 'id',
        },
      },
      executor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Tables.USER,
          key: 'id',
        },
      },
      profile_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Tables.PROFILE,
          key: 'id',
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Tables.CATEGORY,
          key: 'id',
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price_to: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      status_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      place: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cancel_comment: {
        type: DataTypes.TEXT,
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
