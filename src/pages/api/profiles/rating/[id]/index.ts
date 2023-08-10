import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import { IRequest } from '../../../../../../common/types/request';
import nc from 'next-connect';
import checkAuth from '@/middlewares/checkAuth';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import { Roles } from '../../../../../../common/enums/roles';
import { createRating, updateRating } from '@/controllers/rating';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.post(async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id, req.body);
    if (!id) throw new Error('Id is required.');
    const data = await createRating(id.toString(), req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.put(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error('Id is required.');
    console.log(id, req.body);
    const data = await updateRating(id.toString(), req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
