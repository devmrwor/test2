import type { NextApiResponse } from 'next';
import nc from 'next-connect';
import checkAuth from '@/middlewares/checkAuth';
// import checkIsEmailVerified from '@/middlewares/checkIsEmailVerified';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { IRequest } from '../../../../../common/types/request';
import { deleteUserById, getUserById, updateUserById } from '@/controllers/user';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const id = req.token?.id;
    const user = await getUserById(+(id as string));
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorMessage(error, 'Internal server error.'));
  }
});

// handler.use(checkIsEmailVerified);

handler.put(async (req, res) => {
  try {
    const id = req.token?.id;
    const user = await updateUserById(id as unknown as string, req.body);

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorMessage(error, 'Internal server error.'));
  }
});

handler.delete(async (req, res) => {
  try {
    const id = req.token?.id;
    if (!id) {
      throw new Error('User not found.');
    }
    await deleteUserById(id as unknown as string);

    res.status(200).json({ message: 'User deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json(getErrorMessage(error, 'Internal server error.'));
  }
});

export default handler;
