import { models } from '@lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { Model } from 'sequelize';
import { IUser } from '../../../../common/types/user';
import { uniteRoutes } from '@/utils/uniteRoute';
import { EmailRoutes, Routes } from '../../../../common/enums/api-routes';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  const { token, client } = req.query;

  try {
    const user = (await models.User.findOne({ where: { email_token: token } })) as Model<IUser>;

    if (!user) {
      return res.redirect(uniteRoutes([Routes.EMAIL, EmailRoutes.ERROR]));
    }

    user.set('is_email_verified', true);

    await user.save();

    res.redirect(uniteRoutes([Routes.EMAIL, EmailRoutes.RESET], { token: token as string }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'internal_server_error' });
  }
});

export default handler;
