import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { deleteUserById, getUserById, toggleIsBlockedUserById, updateUserById } from '@/controllers/user';
import { Roles } from '../../../../../common/enums/roles';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    const user = await getUserById(id as string);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(getErrorMessage(error, 'Internal server error.'));
  }
});

handler.put(async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.query;
    const user = await updateUserById(id as string, JSON.parse(req.body));
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(getErrorMessage(error, 'Internal server error.'));
  }
});

handler.patch(async (req, res) => {
  try {
    const { id } = req.query;
    const user = await toggleIsBlockedUserById(id as string);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json(getErrorMessage(error, 'Internal server error.'));
  }
});

handler.delete(async (req, res) => {
  try {
    const { id } = req.query;
    const message = await deleteUserById(id as string);
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(400).json(getErrorMessage(error, 'Internal server error.'));
  }
});

export default handler;
