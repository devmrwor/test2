import { CustomerTypes } from '../enums/customer-type';
import { Roles } from '../enums/roles';
import { MessengerItem } from './messenger';
import { IProfile } from './profile';

export interface IUser {
  id?: number;
  role: Roles;
  name: string;
  phone: string;
  is_blocked: boolean;
  photo: string;
  email: string;
  telegram_id: string;
  google_id: string;
  facebook_id: string;
  address: string;
  password_hash: string;
  password?: string;
  username?: string;
  surname?: string;
  gender?: string;
  patronymic?: string;
  sort_order?: number;
  is_entry_allowed?: boolean;
  authentication?: boolean;
  not_allowed_to_change_password?: boolean;
  require_logging_password?: boolean;
  additional_phones?: string[];
  additional_emails?: string[];
  profiles?: IProfile[];
  is_email_verified?: boolean;
  email_token?: string | null;
  show_address_publicly: boolean;
  type: CustomerTypes;
  last_active: Date;
  messengers?: MessengerItem[];
  login_at?: Date;
  created_at: Date;
  updated_at: Date;
}
