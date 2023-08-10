import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import { IRequest } from '../../../../../../common/types/request';
import nc from 'next-connect';
import checkAuth from '@/middlewares/checkAuth';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import { Roles } from '../../../../../../common/enums/roles';
import { createRating, updateClientRating, updateRating } from '@/controllers/rating';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.put(async (req, res) => {
  try {
    const { id } = req.query;
    const { id: userId } = req.token;
    if (!id) throw new Error('Id is required.');
    const data = await updateClientRating(id as string, userId, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
