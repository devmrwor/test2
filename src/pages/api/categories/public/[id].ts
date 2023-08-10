import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import { getCategoryById } from '../../../../controllers/category';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { IRequest } from '../../../../../common/types/request';

const handler = nc<IRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    const data = await getCategoryById(id as string);
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
