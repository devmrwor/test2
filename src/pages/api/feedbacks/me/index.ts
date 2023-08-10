import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { createFeedback, getFeedbacksByUserId } from '@/controllers/feedback';
import { IRequest } from '../../../../../common/types/request';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const { id } = req.token;
    const feedbacks = await getFeedbacksByUserId(id);
    res.status(201).json(feedbacks);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.post(async (req, res) => {
  try {
    const { id } = req.token;
    const newFeedback = await createFeedback(id, req.body);
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
