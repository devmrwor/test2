import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import checkAuth from '@/middlewares/checkAuth';
import { Roles } from '../../../../common/enums/roles';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { createUser, getUsers } from '@/controllers/user';
import { SortOrders } from '../../../../common/enums/sort-order';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.get(async (req, res) => {
  try {
    const { page, limit, filter, sortOrder, sortField } = req.query;
    if (!page || !limit) throw new Error('Page and limit are required.');
    const users = await getUsers(
      +page as number,
      +limit as number,
      filter as Roles,
      sortField as string,
      sortOrder as SortOrders
    );
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorMessage(error, 'Internal server error.'));
  }
});

handler.post(async (req, res) => {
  try {
    const user = await createUser(JSON.parse(req.body));
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorMessage(error, 'Internal server error.'));
  }
});

export default handler;
