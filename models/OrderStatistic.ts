import { DataTypes, Sequelize } from 'sequelize';
import { Tables } from '../common/enums/tables';
import { Models } from '../common/enums/models';

export default (sequelize: Sequelize) => {
  const OrderStatistic = sequelize.define(
    Models.ORDER_STATISTIC,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
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
      defaultScope: {
        attributes: { exclude: ['created_at', 'updated_at'] },
      },
    }
  );

  return OrderStatistic;
};
