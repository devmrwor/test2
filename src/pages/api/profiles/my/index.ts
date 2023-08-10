import { createProfile, getProtectedProfiles, getPublicProfiles } from '@/controllers/profile';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { CustomerTypes } from '../../../../../common/enums/customer-type';
import { IRequest } from '../../../../../common/types/request';
import { SortOrders } from '../../../../../common/enums/sort-order';
import checkAuth from '@/middlewares/checkAuth';
import { Roles } from '../../../../../common/enums/roles';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const { id } = req.token;
    const { page, limit, customerType, searchText, sortOrder, sortField, ...filter } = req.query;

    filter['user_id'] = id;

    const data = await getPublicProfiles(
      +(page as string),
      +(limit as string),
      customerType as CustomerTypes,
      searchText as string,
      sortField as string,
      sortOrder as SortOrders,
      filter as Object
    );

    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.post(async (req, res) => {
  try {
    const { id } = req.token;
    const body = JSON.parse(req.body);

    const data = await createProfile(id, body);
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
