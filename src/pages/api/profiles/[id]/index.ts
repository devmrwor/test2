import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { createProfile, deleteProfileById, getProfileById, updateUserProfile } from '@/controllers/profile';
import { IRequest } from '../../../../../common/types/request';
import { uploadSingleImage } from '@/middlewares/uploadSingleImage';
import { getImagePath } from '@/utils/getImagePath';
import { uploadMultipleImages } from '@/middlewares/uploadMultipleImages';
import { filterNullFields } from '@/utils/filterNullFields';
import { PROFILE_IMAGES } from '../../../../../common/constants/file-fields';
import { uploadImagesFields } from '@/middlewares/uploadImagesFields';
import { ProfileLanguages } from '../../../../../common/enums/profile-languages';

const handler = nc<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.delete(async (req, res) => {
  try {
    const { id } = req.query;
    const { id: userId } = req.token;
    if (!id) throw new Error('No id provided');

    const message = await deleteProfileById(id as string, userId.toString());
    res.status(200).json({ message });
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.get(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error('No id provided');

    console.log(id);
    const profile = await getProfileById(parseInt(id as string));
    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.post(async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error('No id provided');

    const data = await createProfile(id.toString(), req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.use(
  uploadImagesFields([
    { name: PROFILE_IMAGES, maxCount: 10 },
    { name: 'photo', maxCount: 1 },
  ])
);

handler.put(async (req, res) => {
  try {
    const { id, language } = req.query;
    const { id: userId, role } = req.token;
    if (!id) throw new Error('No id provided');
    const photo = req?.files?.photo?.[0] ? getImagePath(req?.files?.photo?.[0].filename) : req.body.photo;

    const profileImages = req?.files?.[PROFILE_IMAGES];

    if (photo) {
      req.body.photo = photo;
    }

    if (profileImages) {
      if (req.body.portfolio_photos === 'null') req.body.portfolio_photos = [];
      const updatedProfilePhotos = [
        ...(req.body.portfolio_photos || []),
        ...profileImages.map((image) => getImagePath(image.filename)),
      ];
      req.body.portfolio_photos = updatedProfilePhotos;
    }

    filterNullFields(req);

    const updatedProfile = await updateUserProfile(
      +id,
      userId.toString(),
      role,
      req.body,
      language as ProfileLanguages
    );

    res.status(200).json(updatedProfile);
  } catch (err) {
    console.log(err);

    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
