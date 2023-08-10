import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { getFeedbacksByProfileId, updateFeedback } from '@/controllers/feedback';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';
import { Roles } from '../../../../common/enums/roles';
import checkAuth from '@/middlewares/checkAuth';
import { IRequest } from '../../../../common/types/request';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error('Id is not provided');

    const orders = await getFeedbacksByProfileId(+id);
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.post(async (req, res) => {
  try {
    const { id } = req.query;
    const { id: userId, role } = req.token;
    if (!id) {
      throw new Error('Id is not provided');
    }
    const newOrder = await updateFeedback(+id, userId, role, req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json(getErrorMessage(error));
  }
});

export default handler;
