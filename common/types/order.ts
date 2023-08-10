import { IProfile } from "./profile";

export interface IOrder {
  id: number;
  customer_id: number;
  executor_id: number;
  profile_id: number;
  category_id: number;
  executor: IProfile;
  subcategory_id?: number;
  description: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}
