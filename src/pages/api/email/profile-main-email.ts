import { models } from '@lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { Model } from 'sequelize';
import { IUser } from '../../../../common/types/user';
import { uniteRoutes } from '@/utils/uniteRoute';
import { EmailRoutes, Routes } from '../../../../common/enums/api-routes';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  const { token } = req.query;
  const { client } = req.query;

  try {
    const profile = (await models.Profile.findOne({ where: { email_token: token } })) as Model<IUser>;

    if (!profile) {
      return res.redirect(uniteRoutes([Routes.EMAIL, EmailRoutes.ERROR])).json({ message: 'Invalid token.' });
    }

    profile.set('is_email_verified', true);
    profile.set('email_token', null);

    await profile.save();

    res
      .redirect(
        uniteRoutes([Routes.EMAIL, EmailRoutes.VERIFIED], {
          client: client as string,
        })
      )
      .json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error.' });
  }
});

export default handler;
