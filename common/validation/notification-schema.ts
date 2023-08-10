import Joi from "joi";
import { INotification } from "../types/notification";

const NotificationSchema = Joi.object<INotification>({
  id: Joi.number(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  start_date_time: Joi.string().required(),
  displaying_page: Joi.string().required(),
  status: Joi.string().required(),
  banner: Joi.any(),
  banner_appearance: Joi.number(),
  sort_order: Joi.number(),
  show_banner: Joi.boolean(),
  created_at: Joi.date(),
  updated_at: Joi.date(),
});

export default NotificationSchema;
