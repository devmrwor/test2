import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import { createCategory, getCategories } from '../../../controllers/category';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Roles } from '../../../../common/enums/roles';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import checkAuth from '@/middlewares/checkAuth';
import { CategoryFilter } from '../../../../common/enums/category-filter';
import { IRequest } from '../../../../common/types/request';
import { CATEGORY_ACTIVE_IMAGE, CATEGORY_PASSIVE_IMAGE } from '../../../../common/constants/file-fields';
import { getImagePath } from '@/utils/getImagePath';
import { uploadImagesFields } from '@/middlewares/uploadImagesFields';
import { filterNullFields } from '@/utils/filterNullFields';

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
    data.rows.map((el) => {
      el.meta_tags = typeof el.meta_tags === 'string' ? el.meta_tags.split(',') : el.meta_tags;
    });
    res.json(data);
  } catch (err) {
    console.log(getErrorMessage(err));
    res.status(400).json(getErrorMessage(err));
  }
});

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.post(async (req, res) => {
  try {
    const categories = JSON.parse(req.body);
    if (typeof categories.meta_tags === 'string') {
      categories.meta_tags = JSON.parse(categories.meta_tags);
    }
    const data = await createCategory(categories);

    res.json(data);
  } catch (err) {
    console.log(getErrorMessage(err));
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
