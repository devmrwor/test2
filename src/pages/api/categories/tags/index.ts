import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { getCategoryTags, createCategoryTags, removeCategoryTags } from '@/controllers/category';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import { Roles } from '../../../../../common/enums/roles';
import { IRequest } from '../../../../../common/types/request';
import { FeedbackRoutes } from '../../../../../common/enums/api-routes';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.CUSTOMER, Roles.ADMIN]));

handler.get(async (req, res) => {
	try {
		const { page, limit = 0, sortOrder, searchText } = req.query;
		const categoryTags = await getCategoryTags(
			+(page as string),
			+(limit as string),
			searchText as string,
			+(sortOrder as string)
		);

		res.status(200).json(categoryTags);
	} catch (error) {
		console.log(getErrorMessage(error));

		res.status(400).json(getErrorMessage(error));
	}
});

handler.post(async (req, res) => {
	try {
		const { category_id, language, tags = [] } = req.body;

		const newRecord = await createCategoryTags({ category_id, language, tags });

		res.status(201).json(newRecord);
	} catch (error) {
		console.log(getErrorMessage(error));

		res.status(400).json(getErrorMessage(error));
	}
});

handler.delete(async (req, res) => {
	try {
		const { id } = req.body;

		await removeCategoryTags(id);

		res.status(200).json({ message: `category ${id} was removed` });
	} catch (error) {
		console.log(getErrorMessage(error));

		res.status(400).json(getErrorMessage(error));
	}
});

export default handler;
