import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Roles } from '../../../../../common/enums/roles';
import { getUserById } from '@/controllers/user';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    const profile = await getUserById(id as string);
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(400).json(getErrorMessage(error, 'Internal server error.'));
  }
});

export default handler;
