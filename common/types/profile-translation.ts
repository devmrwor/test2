import { ProfileLanguages } from "../enums/profile-languages";

export interface IProfileTranslation {
  id: number;
  profile_id: number;
  name: string;
  surname: string;
  description: string;
  language: ProfileLanguages;
  address: string;
  company_name: string;
}
