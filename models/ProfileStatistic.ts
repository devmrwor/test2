import { DataTypes, Sequelize } from 'sequelize';
import { Tables } from '../common/enums/tables';
import { Models } from '../common/enums/models';

export default (sequelize: Sequelize) => {
  const ProfileStatistic = sequelize.define(
    Models.PROFILE_STATISTIC,
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
      orders: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      orders_complete: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reviews_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reviews_rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: Tables.PROFILE,
          key: 'id',
        },
      },
    },
    {
      paranoid: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      defaultScope: {
        attributes: { exclude: ['created_at', 'updated_at', 'deletedAt'] },
      },
    }
  );

  return ProfileStatistic;
};
