import { Sequelize, DataTypes } from 'sequelize';
import { Models } from '../common/enums/models';
import { JobTypes } from '../common/enums/job-types';
import { CustomerTypes } from '../common/enums/customer-type';

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.USER,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      patronymic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_entry_allowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      authentication: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      not_allowed_to_change_password: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      require_logging_password: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      additional_phones: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      additional_emails: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebook_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      google_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telegram_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      email_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company_site: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company_tin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      show_orders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      show_waiting_for_review: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      show_address_publicly: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      show_messengers: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      show_company_feedbacks: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      show_feedbacks: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: CustomerTypes.INDIVIDUAL,
      },
      messengers: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      selfie_with_document: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      document_photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      is_documents_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      additional_photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      login_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      last_active: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
        attributes: { exclude: ['password_hash'] },
      },
      validate: {
        isAccountUsed() {
          if (!(this.email || this.facebook_id || this.google_id || this.telegram_id)) {
            throw new Error('One of logins must be used');
          }
        }
      },
    }
  );
};
