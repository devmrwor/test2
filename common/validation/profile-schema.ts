import Joi from 'joi';
import { CustomerTypes } from '../enums/customer-type';

export const ProfileFormSchema = Joi.object({
  category_id: Joi.number().required(),
  type: Joi.string().valid(CustomerTypes.INDIVIDUAL, CustomerTypes.COMPANY).required(),
  name: Joi.string().max(12).required(),
  surname: Joi.string().max(12).required(),
  phone: Joi.string().allow('', null),
  education: Joi.any(),
  tags: Joi.array().min(1).items(Joi.string()).required(),
  employment: Joi.any().required(),
  languages: Joi.any(),
  payment_details: Joi.any(),
  is_working_remotely: Joi.boolean().allow('', null),
  show_address_publicly: Joi.boolean().allow('', null),
  show_additional_address_publicly: Joi.boolean().allow('', null),
  can_visit_client: Joi.boolean().allow('', null),
  description: Joi.string().allow('', null),
  volunteering: Joi.boolean().allow('', null),
  portfolio_photos: Joi.any(),
  address: Joi.string().required(),
  remote_address: Joi.string().allow('', null),
  additional_address: Joi.string().required(),
  email: Joi.string().required(),
  photo: Joi.any(),
  service_radius: Joi.any(),
  gender: Joi.string().required(),
  is_main_job: Joi.string(),
  phone_numbers: Joi.any(),
  messengers: Joi.any(),
  job_type: Joi.string().required(),
  company_name: Joi.any(),
  services_pricelist: Joi.any(),
  show_to_executors: Joi.any(),
  profile_language: Joi.any(),
  selfie_with_document: Joi.any(),
  document_photo: Joi.any(),
  additional_phones: Joi.any(),
  is_documents_confirmed: Joi.any(),
  translations: Joi.any(),
  lowest_price: Joi.any(),
  highest_price: Joi.any(),
  languages_codes: Joi.any(),
  company_tin: Joi.any(),
  company_logo: Joi.string().allow('', null),
  additional_photos: Joi.any(),
  additional_emails: Joi.any(),
});

export const ClientProfileSchema = ProfileFormSchema.keys({
  category_id: Joi.number().required().messages({
    'any.required': 'profile_validation.category_required',
  }),
  tags: Joi.array().min(1).items(Joi.string()).required().messages({
    'any.required': 'profile_validation.tags_required',
  }),
  languages: Joi.any(),
  name: Joi.string().required().messages({
    'string.base': 'profile_validation.name_required',
    'any.required': 'profile_validation.name_required',
    'string.empty': `profile_validation.name_not_empty`,
  }),
  surname: Joi.string().required().messages({
    'string.base': 'profile_validation.surname_required',
    'any.required': 'profile_validation.surname_required',
    'string.empty': `profile_validation.surname_not_empty`,
  }),
  address: Joi.string().required().messages({
    'string.base': 'profile_validation.address_required',
    'any.required': 'profile_validation.address_required',
    'string.empty': `profile_validation.address_not_empty`,
  }),
  additional_address: Joi.any(),
  employment: Joi.any(),
  gender: Joi.any(),
  job_type: Joi.any(),
});