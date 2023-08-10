import { getProfileById } from '@/controllers/profile';
import { incrementProfileViews } from '@/controllers/profileStatistic';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { IRequest } from '../../../../../../common/types/request';

const handler = nc<IRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    const data = await getProfileById(+(id as string));
    // make it async to speed up response
    incrementProfileViews(+(id as string));
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
