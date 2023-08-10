import { IProfile } from './profile';

export interface ICategory {
  id: number;
  name: string;
  sort_order: number;
  active_icon: string;
  passive_icon: string;
  status: boolean;
  parent_id: number;
  meta_tags: string[];
  translations: [];
  language: string;
  subcategories: ICategory[];
  profiles?: IProfile[];
  profiles_count?: number;
  users_count?: number;
  created_at: Date;
  updated_at: Date;
}

export interface ICategoryForm extends ICategory {
  uploadedActive: File | null;
  uploadedPassive: File | null;
}
