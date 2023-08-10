import Joi from 'joi';
import { CustomerTypes } from '../enums/customer-type';

export const mainProfileSchema = Joi.object({
  photo: Joi.string().uri().allow(null, ''),
  name: Joi.string().max(12).required(),
  email: Joi.string().required(),
  phone: Joi.string().allow(null, ''),
  gender: Joi.string().required(),
  messengers: Joi.any().required(),
  translations: Joi.any(),
  profile_language: Joi.any(),
  show_address_publicly: Joi.any(),
  address: Joi.string().allow(null, ''),
  selfie_with_document: Joi.any(),
  additional_phones: Joi.any(),
  document_photo: Joi.any(),
  is_documents_confirmed: Joi.any(),
  type: Joi.string().valid(CustomerTypes.INDIVIDUAL, CustomerTypes.COMPANY).required(),
  lowest_price: Joi.any(),
  highest_price: Joi.any(),
  languages_codes: Joi.any(),
});
