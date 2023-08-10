import Joi from 'joi';

export const importUsersSchema = Joi.object({
  category: Joi.any().required(),
  subcategory: Joi.any().required(),
  language: Joi.string().required(),
  is_main: Joi.bool().required(),
});
