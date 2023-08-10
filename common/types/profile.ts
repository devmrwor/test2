import { JobTypes } from '../enums/job-types';
import { ProfileLanguages } from '../enums/profile-languages';
import { ICategory } from './category';
import { Language } from './language';
import { MessengerItem } from './messenger';
import { IProfileRating } from './profile-rating';
import { IProfileTranslation } from './profile-translation';

export interface IProfile {
  id: number;
  user_id: number;
  name: string;
  surname: string;
  category_id: number;
  category: ICategory;
  subcategory_id?: number;
  photo: string;
  additional_photos: string[];
  type: string;
  gender: string;
  password?: string;
  company_name?: string;
  company_tin?: string;
  phone: string;
  phone_numbers: string[]; // JSON or array field
  messengers: MessengerItem[]; // JSON field
  remote_address?: string;
  email: string;
  additional_emails: string[];
  is_working_remotely: boolean;
  address: string;
  show_address_publicly: boolean;
  additional_address?: string;
  show_additional_address_publicly: boolean;
  can_visit_client: boolean;
  service_radius: string;
  portfolio_photos: string[]; // JSON or array field
  services_pricelist: any[]; // JSON field
  video_presentation?: string;
  education: object; // JSON field
  description: string;
  tags: string[]; // JSON or array field
  employment: string;
  languages: Language[]; // JSON or array field
  profile_language: ProfileLanguages;
  volunteering: boolean;
  payment_details: object; // JSON field
  is_main_job: boolean;
  job_type: JobTypes;
  show_to_executors: boolean;
  translations?: IProfileTranslation[];
  is_main?: boolean;
  selfie_with_document: string;
  document_photo: string;
  is_documents_confirmed: boolean;
  profile_rating: IProfileRating;
  additional_phones: string[];
  lowest_price?: number;
  highest_price?: number;
  languages_codes?: string;
  company_logo?: string;
  is_email_verified?: boolean;
  email_token?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface IProfileForm extends IProfile {
  uploadedImages: File[];
}

export type IRatingFormProfile = Pick<
  IProfileForm,
  'selfie_with_document' | 'document_photo' | 'languages' | 'is_documents_confirmed'
>;

export interface IProfileImport extends IProfile {
  email: string;
  viber: string;
  telegram: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  twitter: string;
  site: string;
}
