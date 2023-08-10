import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import { IRequest } from '../../common/types/request';
import { models } from '@lib/db';

export default async function checkIsEmailVerified(req: IRequest, res: NextApiResponse, next: () => void) {
  try {
    if (!req.token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // const { is_email_verified } = req.token;

    // if (!is_email_verified) {
    //   return res.status(403).json({ message: 'Email is not verified' });
    // }

    const { email } = req.token;

    const user = await models.User.findOne({ where: { email } });
    if (!user?.get('is_email_verified')) {
      return res.status(403).json({ message: 'Email is not verified' });
    }

    next();
  } catch (error) {
    res.status(400).json(getErrorMessage(error));
  }
}
