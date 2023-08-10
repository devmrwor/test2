export interface IFilter {
  category: { name: string; category_id: string };
  address: string;
  service_radius: string;
  type: string;
  job_type: string;
  gender: string;
  lowest_price: string;
  highest_price: string;
  languages: string[];
  high_rating: boolean;
  secure_deal_available: boolean;
  is_documents_confirmed: boolean;
  photo: boolean;
  is_working_remotely: boolean;
}
