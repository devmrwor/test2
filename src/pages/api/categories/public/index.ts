import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import { getCategories } from '../../../../controllers/category';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { CategoryFilter } from '../../../../../common/enums/category-filter';
import { IRequest } from '../../../../../common/types/request';

const handler = nc<IRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    const { page, limit, filter, searchText, folderView, sortField, sortOrder } = req.query;

    const data = await getCategories(
      parseInt(page as string) || undefined,
      parseInt(limit as string) || undefined,
      filter as CategoryFilter,
      searchText as string,
      (folderView as string) === 'true',
      sortField as string,
      sortOrder as string
    );
    const filteredData = data.rows.filter((category) => category.status);

    filteredData.map((el) => {
      el.meta_tags = typeof el.meta_tags === 'string' ? el.meta_tags.split(',') : el.meta_tags;
    });

    res.json(filteredData);
  } catch (err) {
    console.log(getErrorMessage(err));
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
