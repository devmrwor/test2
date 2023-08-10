export interface IProfileRating {
  id: number;
  profile_id: number;
  rating: number;
  is_top_category: boolean;
  secure_deal_available: boolean;
  services_insured: boolean;
  top_executor: boolean;
  order_completed_on_time: boolean;
  premium_executor: boolean;
  provides_volunteer_assistance: boolean;
  created_at: Date;
  updated_at: Date;
}

export type IRatingForm = Omit<IProfileRating, 'created_at' | 'id' | 'updated_at'>;

export type ExecutorRatingForm = Pick<
  IRatingForm,
  'provides_volunteer_assistance' | 'services_insured' | 'secure_deal_available'
>;
