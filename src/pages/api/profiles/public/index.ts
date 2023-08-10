import { getPublicProfiles } from '@/controllers/profile';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { CustomerTypes } from '../../../../../common/enums/customer-type';
import { IRequest } from '../../../../../common/types/request';
import { SortOrders } from '../../../../../common/enums/sort-order';

const handler = nc<IRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    const { page, limit, customerType, searchText, sortOrder, sortField, ...filter } = req.query;
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

export default handler;
