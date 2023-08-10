import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { models } from '@lib/db';
import { Bcrypt } from '@/utils/bcrypt';
import securityMiddleware from '@/middlewares/security';
import { v4 as uuidv4 } from 'uuid';
import { getToken, sendVerificationEmail } from '@/controllers/email';
import { ApiEmailSubRoutes, EmailRoutes, Routes } from '../../../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(securityMiddleware);

handler.post(async (req, res) => {
  const { email, password, name, role } = req.body;
  const { lang, verifyEmail: shouldVerify, client } = req.query;
  const verifyEmail = shouldVerify == undefined ? true : shouldVerify === 'true';

  try {
    let user = await models.User.findOne({ where: { email } });

    if (user && !user.email_token) {
      return res.status(409).json({ message: 'user_already_exists' });
    }

    if (user && !verifyEmail) {
      return res.json({ message: 'user_not_verified' });
    }

    // generate a random password before user reset it
    const hashedPassword = await Bcrypt.hash(verifyEmail ? uuidv4() : password, 10);

    if (verifyEmail) {
      const emailVerificationToken = getToken();
      if (user) {
        user.set('email_token', emailVerificationToken);
        await user.save();
      } else {
        user = await models.User.create({
          email,
          password_hash: hashedPassword,
          name,
          role,
          is_email_verified: false,
          email_token: emailVerificationToken,
        });
      }
      await sendVerificationEmail({
        email,
        token: emailVerificationToken,
        emailSubRoute: ApiEmailSubRoutes.USER,
        lang: lang as string,
        client: (client as string) === 'true',
      });
    } else {
      user = await models.User.create({
        email,
        password_hash: hashedPassword,
        name,
        role,
        is_email_verified: false,
      });
    }

    res.status(201).json({
      message: verifyEmail ? 'User created successfully. Verification email sent.' : 'User created successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'internal_server_error' });
  }
});

export default handler;
