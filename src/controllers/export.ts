import { models } from '@lib/db';
import { ExportData } from '../../common/enums/import-export-routes';
import { IExportData } from '../../common/types/exportData';
import { SortOrders } from '../../common/enums/sort-order';
import { Order } from 'sequelize';

export const deleteExportData = async (id: string) => {
  await models.ExportData.destroy({ where: { id } });
  return 'File deleted successfully.';
};

export const getExportData = async (
  page: number,
  limit: number,
  type: ExportData,
  sortOrder: SortOrders,
  sortField: string
) => {
  const offset = Math.max(0, (page - 1) * limit);

  const order: Order = [];

  const fields = {
    id: 'id',
    count: 'count_of_rows',
    category: 'category',
    files: 'file_name',
    date: 'created_at',
    type: 'type',
  };

  const field = fields[sortField] || 'id';
  const dir = sortOrder === SortOrders.ASC ? SortOrders.ASC : SortOrders.DESC;

  if (field === 'category') {
    order.push([{ model: models.Category, as: 'category' }, 'name', dir]);
  } else order.push([field, dir]);

  const exportData = await models.ExportData.findAndCountAll({
    where: { type },
    limit,
    offset,
    order,
    include: [{ model: models.Category, as: 'category', required: false }],
  });
  return exportData;
};

export const createExportData = async (data: IExportData) => {
  console.log(models);
  const exportData = await models.ExportData.create(data);
  return exportData;
};
