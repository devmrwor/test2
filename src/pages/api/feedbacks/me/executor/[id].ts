import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { createExecutorFeedback } from '@/controllers/feedback';
import { IRequest } from '../../../../../../common/types/request';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.post(async (req, res) => {
  try {
    const { id } = req.token;
    const { id: executorId } = req.query;
    const newFeedback = await createExecutorFeedback(+(executorId as string), id, req.body);
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
