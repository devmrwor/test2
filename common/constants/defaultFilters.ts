import { ExecutorTypes } from '../enums/executor-type';
import { Gender } from '../enums/gender';

export const defaultFilters = {
  category: { name: '', category_id: null },
  address: '',
  service_radius: '',
  type: ExecutorTypes.ANY,
  job_type: 'any',
  gender: Gender.ANY,
  lowest_price: '',
  highest_price: '',
  languages: [],
  high_rating: false,
  secure_deal_available: false,
  is_documents_confirmed: false,
  photo: false,
  is_working_remotely: false,
};
