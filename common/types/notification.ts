import { Dayjs } from "dayjs";
import { NotificationTypes } from "../enums/notification-types";

export interface INotification {
  id?: number;
  status: NotificationTypes;
  start_date: string;
  end_date: string;
  start_date_time: string;
  displaying_page: string;
  banner: string;
  banner_appearance: number;
  sort_order: number;
  show_banner: boolean;
  geography: string;
  look: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}
