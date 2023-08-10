import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ExportData } from '../../common/enums/import-export-routes';
import { IExportData } from '../../common/types/exportData';
import { IPaginationResponse } from '../../common/types/pagination-response';
import { ApiRoutes } from '../../common/enums/api-routes';
import { SortOrders } from '../../common/enums/sort-order';

export const getExportData = async (
  page: number,
  limit: number,
  type: ExportData,
  sortOrder: SortOrders,
  sortField: string
): Promise<IPaginationResponse<IExportData>> => {
  const url = new URL(uniteApiRoutes([ApiRoutes.EXPORT_DATA]));

  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
    type,
    sortField,
    sortOrder,
  };

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  const response = await fetch(url.toString());

  if (!response.ok) throw new Error('Error fetching data');

  const data = await response.json();

  return data;
};

export const deleteExportData = async (id: number) => {
  const response = await fetch(uniteApiRoutes([ApiRoutes.EXPORT_DATA, id]), {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Error deleting data');

  const data = await response.json();

  return data;
};
