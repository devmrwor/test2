import { Sequelize, DataTypes } from 'sequelize';
import { SenderType } from '../common/enums/messages';
import { Models } from '../common/enums/models';
import { Tables } from '../common/enums/tables';

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.CHAT_MESSAGE,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM(SenderType.USER, SenderType.SYSTEM),
        allowNull: false,
        defaultValue: SenderType.USER,
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Tables.USER,
          key: 'id',
        },
      },
      show_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Tables.USER,
          key: 'id',
        },
      },
      chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Tables.CHAT,
          key: 'id',
        },
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      seen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
