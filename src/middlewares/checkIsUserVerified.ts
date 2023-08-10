import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import { IRequest } from '../../common/types/request';
import { models } from '@lib/db';

export default async function checkIsUserVerified(req: IRequest, res: NextApiResponse, next: () => void) {
  try {
    if (!req.token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { email } = req.token;

    const user = await models.User.findOne({ where: { email } });
    if (
      user?.get('is_email_verified') ||
      user?.get('facebook_id') ||
      user?.get('google_id') ||
      user?.get('telegram_id')
    ) {
      return next();
    }

    return res.status(403).json({ message: 'User is not verified' });
  } catch (error) {
    res.status(400).json(getErrorMessage(error));
  }
}
