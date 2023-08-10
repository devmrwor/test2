import { createOrder, getAllOrders } from '@/controllers/order';
import checkAuth from '@/middlewares/checkAuth';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Roles } from '../../../../common/enums/roles';
import { IRequest } from '../../../../common/types/request';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import { getErrorMessage } from '@/utils/getErrorMessage';
import checkIsUserVerified from '@/middlewares/checkIsUserVerified';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);
handler.use(checkIsUserVerified);

handler.post(async (req, res) => {
  try {
    const { id } = req.token;
    const newOrder = await createOrder(id, req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json(getErrorMessage(error));
  }
});

handler.use(rolesMiddleware([Roles.ADMIN]));

handler.get(async (_, res) => {
  try {
    const newOrder = await getAllOrders();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json(getErrorMessage(error));
  }
});

export default handler;
