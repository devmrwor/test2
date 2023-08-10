import { Sequelize, DataTypes } from 'sequelize';
import { Models } from '../common/enums/models';
import { Tables } from '../common/enums/tables';

export default (sequelize: Sequelize) => {
  return sequelize.define(
    Models.PROFILE,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Tables.USER,
          key: 'id',
        },
      },
      is_main: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Tables.CATEGORY,
          key: 'id',
        },
      },
      profile_language: {
        type: DataTypes.STRING,
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
      company_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company_tin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      additional_photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      additional_emails: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone_numbers: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      remote_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company_logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      messengers: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_working_remotely: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      show_address_publicly: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      additional_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      show_additional_address_publicly: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      can_visit_client: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      service_radius: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      portfolio_photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      services_pricelist: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      lowest_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      highest_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      video_presentation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      education: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      additional_phones: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      employment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      job_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      languages: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      languages_codes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      volunteering: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      payment_details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      show_to_executors: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      // is_email_verified: {
      //   type: DataTypes.BOOLEAN,
      //   allowNull: false,
      //   defaultValue: false,
      // },
      // email_token: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
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
