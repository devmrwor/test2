import { createProfile, getProtectedProfiles } from '@/controllers/profile';
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
    const { page, limit, customerType, searchText, sortOrder, sortField, ...filter } = req.query;
    const role = req.token.role;

    const data = await getProtectedProfiles(
      role,
      parseInt(page as string),
      parseInt(limit as string),
      customerType as CustomerTypes,
      searchText as string,
      sortField as string,
      sortOrder as SortOrders,
      filter as Record<string, string>
    );
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.post(async (req, res) => {
  try {
    const body = JSON.parse(req.body);

    const data = await createProfile(body.user_id || '1', body);
    res.json(data);
  } catch (err) {
    console.log(err.message);
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
