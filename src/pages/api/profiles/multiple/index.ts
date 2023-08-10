import { createMultipleProfiles, createProfile } from '@/controllers/profile';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { IRequest } from '../../../../../common/types/request';
import { Roles } from '../../../../../common/enums/roles';
import rolesMiddleware from '@/middlewares/checkRolesMiddleware';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);
handler.use(rolesMiddleware([Roles.ADMIN]));

handler.post(async (req, res) => {
  const { isTranslations } = req.query;

  try {
    const data = await createMultipleProfiles(JSON.parse(req.body), isTranslations === 'true');
    res.json(data);
  } catch (err) {
    console.log(err.message);
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
