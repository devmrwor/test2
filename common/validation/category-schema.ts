import Joi from "joi";

const CategoryFormSchema = Joi.object({
  status: Joi.boolean().required().messages({
    "any.required": "Status is required",
    "any.only": "Status must be either 'not visible' or 'visible'",
  }),
  name: Joi.string().required().max(40).messages({
    "any.required": "Name is required",
  }),
  active_icon: Joi.string().allow(null, ""),
  passive_icon: Joi.string().allow(null, ""),
  parent_id: Joi.number().optional().allow(null, ""),
  meta_tags: Joi.array().min(1).items(Joi.string()).required(),
  images: Joi.string(),
  sort_order: Joi.number().required(),
  translations: Joi.array().items(Joi.object()),
});

export default CategoryFormSchema;
