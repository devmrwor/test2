import { createTest, getTest } from '@/controllers/test';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { CustomerTypes } from '../../../../common/enums/customer-type';
import { IRequest } from '../../../../common/types/request';
import { SortOrders } from '../../../../common/enums/sort-order';

const handler = nc<IRequest, NextApiResponse>();
handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const { id } = req.query;

    const data = await getTest(
        Number(id)
    );
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.post(async (req, res) => {
  try {
    const body = JSON.parse(req.body);
    const data = await createTest(body.user_id || '1', body);
    res.json(data);
  } catch (err:any) {
    console.log(err.message);
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
