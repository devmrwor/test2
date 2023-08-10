import { updateUserById } from '@/controllers/user';
import { getErrorMessage } from '@/utils/getErrorMessage';
import config from '@config';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function checkAuth(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  try {
    const token = await getToken({ req, secret: config.JWT_SECRET });
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    updateUserById(token.id, {
      last_active: new Date(),
    });
    // @ts-ignore
    req.token = token;
    next();
  } catch (error) {
    res.status(400).json(getErrorMessage(error));
  }
}
