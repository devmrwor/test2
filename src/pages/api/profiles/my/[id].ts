import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { getProfileById, updateProfileByUserId } from '@/controllers/profile';
import { IRequest } from '../../../../../common/types/request';
import checkAuth from '@/middlewares/checkAuth';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error('No id provided');

    const profile = await getProfileById(parseInt(id as string));
    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.put(async (req, res) => {
  try {
    const { id } = req.query;
    const { id: userId } = req.token;

    if (!id) throw new Error('No id provided');

    const updatedProfile = await updateProfileByUserId(userId, +(id as string), JSON.parse(req.body));

    res.status(200).json(updatedProfile);
  } catch (err) {
    console.log(err);

    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
