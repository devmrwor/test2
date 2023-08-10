import { ExportData } from "../enums/import-export-routes";

export interface IExportData {
  id?: number;
  link: string;
  type: ExportData;
  is_successful: boolean;
  count_of_rows: number;
  file_name: string;
  category_id?: number;
  created_at?: Date;
  updated_at?: Date;
}
