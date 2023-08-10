export interface IFeedback {
  id: number;
  order_id: number;
  user_id: number;
  profile_id: number;
  rating: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
}
