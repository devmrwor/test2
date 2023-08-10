import Joi from 'joi';
import { IProfileRating } from '../types/profile-rating';

const ClientRatingSchema = Joi.object<Partial<IProfileRating>>({
  provides_volunteer_assistance: Joi.boolean(),
  services_insured: Joi.boolean(),
  secure_deal_available: Joi.boolean(),
});

export default ClientRatingSchema;
