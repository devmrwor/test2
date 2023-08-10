import { getCustomers } from '@/controllers/profile';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import { CustomerTypes } from '../../../../common/enums/customer-type';
import { IRequest } from '../../../../common/types/request';
import nc from 'next-connect';
import { SortOrders } from '../../../../common/enums/sort-order';

const handler = nc<IRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    const { page, limit, customerType, searchText, sortOrder, sortField } = req.query;
    const data = await getCustomers({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      customerType: customerType as CustomerTypes,
      searchText: searchText as string,
      sortOrder: sortOrder as SortOrders,
      sortField: sortField as string,
    });
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
