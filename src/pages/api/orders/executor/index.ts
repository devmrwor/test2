import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { getOrdersByUserId } from '@/controllers/order';
import { IRequest } from '../../../../../common/types/request';
import { SortOrders } from '../../../../../common/enums/sort-order';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const { id } = req.token;
    const { page, limit, sortOrder, sortField, ...filter } = req.query;

    const orders = await getOrdersByUserId(id, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      filter: filter as Record<string, string>,
      sortField: sortField as string,
      sortOrder: sortOrder as SortOrders,
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
