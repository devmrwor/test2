import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { models } from '@lib/db';
import config from '@config';
import { Bcrypt, verifySHA256 } from '@/utils/bcrypt';
import { IUser } from '../../../../common/types/user';
import { Roles } from '../../../../common/enums';
import { Model, Op } from 'sequelize';
import { User } from 'next-auth';

function normilizeData({ password_hash = String(Math.random()), role = Roles.CUSTOMER, photo = '', name = 'Anonymous', email = null }) {
  return {
    password_hash: String(password_hash).slice(0, 254),
    photo: String(photo).slice(0, 254),
    name: String(name).slice(0, 254),
    email: email ? String(email).slice(0, 254) : null,
    role,
  }
}
function getUserData(user: Model) {
  return user ? {
    id: user.get('id'),
    email: user.get('email'),
    name: user.get('name'),
    role: user.get('role'),
    is_email_verified: user.get('is_email_verified'),
  } as User : null;
}
// @ts-ignore
async function findUser(params) {
  return models.User.findOne({
    where: params,
    attributes: { include: ['password_hash'] },
  });
}
// @ts-ignore
async function signInEmail({ email, password }) {
  const user = await findUser({ email });

  if (!user || !(await Bcrypt.compare(password, user.get('password_hash') as string))) {
    throw new Error('invalid_email_or_password');
  }

  return {
    id: user.get('id'),
    email: user.get('email'),
    name: user.get('name'),
    role: user.get('role'),
    is_email_verified: user.get('is_email_verified'),
  } as User;
}
// @ts-ignore
async function signInTelegram({ id, hash, name, photo }) {
  if (!id) {
    throw new Error('cannot_register_without_id');
  }

  const telegram_id = String(id);

  let user = await findUser({ telegram_id });

  if (user) {
    return getUserData(user);
  }

  // create a new user for telegram login
  await models.User.findOrCreate({
    where: { telegram_id },
    defaults: {
      ...normilizeData({ password_hash: hash, name, photo }),
    },
  });

  user = await findUser({ telegram_id });

  if (!user) {
    throw new Error('cannot_sign_up_a_new_user');
  }

  return getUserData(user);
}
// @ts-ignore
async function signInOAuth({ provider, id, name, email, image, access_token }) {
  if (!id) {
    throw new Error('cannot_register_without_id');
  }

  const userId = String(id);

  let user = await findUser({
    [Op.or]: [
      { [provider]: userId },
      // @ts-ignore
      (email ? { email } : null),
    ].filter(Boolean)
  });

  if (user) {
    return getUserData(user);
  }

  // create a new user for google login
  await models.User.findOrCreate({
    where: { [provider]: userId },
    defaults: {
      ...normilizeData({ password_hash: access_token, name, photo: image, email }),
    },
  });

  user = await findUser({ [provider]: userId });

  if (!user) {
    throw new Error('cannot_sign_up_a_new_user');
  }

  return getUserData(user);
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
        type: { label: 'type', type: 'string' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('credentials_are_not_valid');
        }
        const { email, password, type, ...query } = credentials;

        if (type === 'telegram') {
          if (!query || !query.hash) {
            throw new Error('invalid_telegram_login');
          }

          // See https://core.telegram.org/widgets/login#checking-authorization
          // @ts-ignore
          const checkString = ['auth_date', 'first_name', 'id', 'last_name', 'photo_url', 'username']
            .filter((key) => query[key])
            .map((key) => `${key}=${query[key]}`)
            .join('\n');
          // @ts-ignore
          if (!verifySHA256(config.TELEGRAM_BOT_TOKEN, checkString, query.hash)) {
            throw new Error('invalid_login_attempt');
          }

          const user = await signInTelegram({
            id: query.id,
            hash: query.hash,
            name: [query.first_name, query.last_name].join(' '),
            photo: query.photo_url,
          });

          return user;
        }

        const user = await signInEmail({ email, password });

        return user;
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  // adapter: SequelizeAdapter.getAdapter(),
  // secret: config.JWT_SECRET,
  jwt: {
    maxAge: config.jwtLifetime,
    secret: config.JWT_SECRET,
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user && (account?.provider === 'facebook' || account?.provider === 'google')) {
        const { name, email, image, id } = user;
        const { access_token } = account;

        const found = await signInOAuth({ provider: `${account.provider}_id`, id, name, image, email, access_token });
        
        return !!found;
      }

      if (account && account.type === 'credentials') {
        const found = await findUser({ id: user.id });

        return !!found;
      }

      return false;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const foundUser = await findUser({
          [Op.or]: [
            { id: Number.isSafeInteger(+user.id) ? +user.id : Number.EPSILON },
            user.email ? { email: user.email } : null,
            { facebook_id: String(user.id) },
            { google_id: String(user.id) },
            { telegram_id: String(user.id) },
          ].filter(Boolean),
        });
        if (foundUser) {
          await foundUser.update({
            login_at: new Date(),
          });
        }
        token.id = foundUser?.id || user.id;
        token.role = user.role;
        token.access_token = account?.access_token;
        token.is_email_verified = user.is_email_verified;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.is_email_verified = token.is_email_verified;
      return session;
    },
  },
  pages: {
    signIn: process.env.NEXT_PUBLIC_ENV_TARGET === 'web' ? '/client/login' : '/auth/login',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
});
