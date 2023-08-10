import { Sequelize, DataTypes } from 'sequelize';
import { Models } from '../common/enums/models';
import { Tables } from '../common/enums/tables';

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.CHAT,
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
        allowNull: false,
        references: {
          model: Tables.USER,
          key: 'id',
        },
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Tables.ORDER,
          key: 'id',
        },
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
