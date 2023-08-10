import nc from 'next-connect';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import { IRequest } from '../../../../../../common/types/request';
import { getUserById } from '@/controllers/user';

const handler = nc<IRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    const data = await getUserById(+(id as string));
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
