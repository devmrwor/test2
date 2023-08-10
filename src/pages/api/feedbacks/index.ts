import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { createFeedback, getAllFeedbacks } from '@/controllers/feedback';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import { Roles } from '../../../../common/enums/roles';
import { IRequest } from '../../../../common/types/request';
import { FeedbackRoutes } from '../../../../common/enums/api-routes';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.post(async (req, res) => {
  try {
    const { id } = req.token;
    const newFeedback = await createFeedback(id, req.body);
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.use(rolesMiddleware([Roles.ADMIN]));

handler.get(async (req, res) => {
  try {
    const { page, limit, userId, feedbackType } = req.query;
    const newOrder = await getAllFeedbacks(
      +(page as string),
      +(limit as string),
      feedbackType as FeedbackRoutes,
      +(userId as string)
    );
    res.status(201).json(newOrder);
  } catch (error) {
    console.log(getErrorMessage(error));

    res.status(400).json(getErrorMessage(error));
  }
});

export default handler;
