import { deleteOrder, getOrder, updateOrder } from '@/controllers/order';
import checkAuth from '@/middlewares/checkAuth';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { Roles } from '../../../../../common/enums/roles';
import { IRequest } from '../../../../../common/types/request';
import { incrementOrderViews } from '@/controllers/orderStatistic';

const handler = nextConnect<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.put(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      throw new Error('Order id is required');
    }
    const { id: userId } = req.token;

    const order = await updateOrder(+id, userId, req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(getErrorMessage(error));
  }
});

handler.delete(async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      throw new Error('Order id is required');
    }
    const { id: userId, role } = req.token;

    const message = await deleteOrder(+id, userId, role);
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res.status(400).json(getErrorMessage(error));
  }
});

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      throw new Error('Order id is required');
    }

    const order = await getOrder(+id);
    if (order.customer_id !== req.token.id) {
      throw new Error('You are not allowed to view this order');
    }

    incrementOrderViews(+id);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(getErrorMessage(error));
  }
});

export default handler;
