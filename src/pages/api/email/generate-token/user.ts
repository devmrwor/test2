import nc from 'next-connect';
import { NextApiResponse } from 'next';
import { IRequest } from '../../../../../common/types/request';
import { getToken, sendVerificationEmail } from '@/controllers/email';
import { ApiEmailSubRoutes } from '../../../../../common/enums/api-routes';
import { models } from '@lib/db';

const handler = nc<IRequest, NextApiResponse>();

handler.post(async (req, res) => {
  try {
    const { email } = req.body;
    const { lang, client } = req.query;

    if (!email) {
      throw new Error('email_is_required');
    }
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'email_not_found' });
    }

    if (user.get('is_email_verified') && client !== 'true') {
      return res.status(400).json({ message: 'email_already_verified' });
    }

    const emailVerificationToken = getToken();
    await sendVerificationEmail({
      email,
      token: emailVerificationToken,
      emailSubRoute: ApiEmailSubRoutes.USER,
      lang: lang as string,
      client: (client as string) === 'true',
    });

    user.set('email_token', emailVerificationToken);

    await user.save();
    res.status(200).json({ message: 'verification_email_sent' });
  } catch (error) {
    return res.status(500).json({ message: 'failed_to_generate_verification_token' });
  }
});

export default handler;
