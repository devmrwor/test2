import Joi from 'joi';

const AdminFormSchema = (isCreating: boolean) => {
  return Joi.object({
    id: Joi.number(),
    role: Joi.string().required(),
    name: Joi.string().required().min(3),
    phone: Joi.string().required().min(3),
    is_blocked: Joi.any(),
    email: Joi.string().required().min(3),
    password: isCreating ? Joi.string().required() : Joi.string(),
    username: Joi.string().required().min(3).max(12),
    surname: Joi.string().required(),
    patronymic: Joi.string(),
    sort_order: Joi.number(),
    is_entry_allowed: Joi.boolean(),
    authentication: Joi.boolean(),
    not_allowed_to_change_password: Joi.boolean(),
    require_logging_password: Joi.boolean(),
    created_at: Joi.date(),
    updated_at: Joi.date(),
    profiles: Joi.any(),
    photo: Joi.any(),
    gender: Joi.any(),
    address: Joi.any(),
    additional_emails: Joi.any(),
    additional_phones: Joi.any(),
  });
};

export default AdminFormSchema;
