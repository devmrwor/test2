import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import checkAuth from '@/middlewares/checkAuth';
import { Roles } from '../../../../common/enums/roles';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { createExportData, getExportData } from '@/controllers/export';
import { ExportData } from '../../../../common/enums/import-export-routes';
import { SortOrders } from '../../../../common/enums/sort-order';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.get(async (req, res) => {
  try {
    const { page, limit, type, sortOrder, sortField } = req.query;
    if (!page || !limit) throw new Error('Page and limit are required.');
    const exportData = await getExportData(
      +page as number,
      +limit as number,
      type as ExportData,
      sortOrder as SortOrders,
      sortField as string
    );
    res.status(200).json(exportData);
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorMessage(error, 'Internal server error.'));
  }
});

handler.post(async (req, res) => {
  try {
    const exportData = await createExportData(JSON.parse(req.body));
    res.status(200).json(exportData);
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorMessage(error, 'Internal server error.'));
  }
});

export default handler;
