import { getProfilesByUserId } from '@/controllers/profile';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import { CustomerTypes } from '../../../../../common/enums/customer-type';
import { IRequest } from '../../../../../common/types/request';
import nc from 'next-connect';
import { ProfileLanguages } from '../../../../../common/enums/profile-languages';

const handler = nc<IRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    const { page, limit, id, language } = req.query;
    const data = await getProfilesByUserId(
      parseInt(page as string),
      parseInt(limit as string),
      id as string,
      language as ProfileLanguages
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
