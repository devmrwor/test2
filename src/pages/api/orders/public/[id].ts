import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { getOrderModel } from '@/controllers/order';
import { IRequest } from '../../../../../common/types/request';
import { SortOrders } from '../../../../../common/enums/sort-order';
import { incrementOrderViews } from '@/controllers/orderStatistic';

const handler = nc<IRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    const { id } = req.query;

    const order = await getOrderModel(+(id as string));
    incrementOrderViews(order.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
