import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import checkAuth from '@/middlewares/checkAuth';
import { Roles } from '../../../../common/enums/roles';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { createNotifications, getNotifications } from '@/controllers/notification';
import { NotificationTypes } from '../../../../common/enums/notification-types';
import { SortOrders } from '../../../../common/enums/sort-order';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.get(async (req, res) => {
  try {
    const { page, limit, type, sortField, sortOrder } = req.query;
    if (!page || !limit) throw new Error('Page and limit are required.');
    const notifications = await getNotifications(
      +page as number,
      +limit as number,
      type as NotificationTypes,
      sortField as string,
      sortOrder as SortOrders
    );
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorMessage(error, 'Internal server error.'));
  }
});

handler.post(async (req, res) => {
  try {
    const notifications = await createNotifications(req.body);
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorMessage(error, 'Internal server error.'));
  }
});

export default handler;
