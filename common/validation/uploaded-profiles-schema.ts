import Joi from 'joi';
import { CustomerTypes } from '../enums/customer-type';

export const UploadedProfilesSchema = Joi.array().items(
  Joi.object({
    id: Joi.number(),
    user_id: Joi.number(),
    type: Joi.string().valid(CustomerTypes.INDIVIDUAL, CustomerTypes.COMPANY).required(),
    name: Joi.string().max(12).required(),
    category_id: Joi.number(),
    languages: Joi.string(),
    volunteering: Joi.boolean(),
    address: Joi.string().required(),
    photo: Joi.any(),
    service_radius: Joi.any(),
    company_name: Joi.string(),
    Telegram: Joi.string(),
    WhatsApp: Joi.string(),
    Viber: Joi.string(),
    Instagram: Joi.string(),
    Facebook: Joi.string(),
    Twitter: Joi.string(),
    tags: Joi.string().regex(/^\s*[\w\s]+(?:,\s*[\w\s]+)*\s*$/),
    description: Joi.string(),
    email: Joi.string().required(),
    phone_numbers: Joi.string(),
  })
);

export const UploadedProfilesAndUsersSchema = Joi.array().items(
  Joi.object({
    id_executor: Joi.number(),
    type_executor: Joi.string(),
    type_executor_agent: Joi.string(),
    name_executor: Joi.string(),
    surname_executor: Joi.string(),
    company_name_executor: Joi.string(),
    email_executor: Joi.string(),
    gender_executor: Joi.number(),
    id_form: Joi.number(),
    category: Joi.string(),
    name_agent: Joi.string(),
    surname_agent: Joi.string(),
    company_name_agent: Joi.string(),
    gender_agent: Joi.number(),
    main_address: Joi.string(),
    employment_agent: Joi.number(),
    description: Joi.string(),
    tags: Joi.string(),
    phone_numbers: Joi.string(),
    languages: Joi.string(),
    email_agent: Joi.string(),
  })
);
