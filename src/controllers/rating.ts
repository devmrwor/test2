import { models } from '@lib/db';
import { IProfileRating } from '../../common/types/profile-rating';
import ClientRatingSchema from '../../common/validation/client-rating-schema';

export const createRating = async (profileId: string, data: any) => {
  const rating = await models.ProfileRating.create({ ...JSON.parse(data), profile_id: profileId });
  return rating;
};

export const updateRating = async (profileId: string, data: any) => {
  const rating = await models.ProfileRating.update(JSON.parse(data), {
    where: { profile_id: profileId },
  });
  return rating;
};

export const updateClientRating = async (profileId: string, userId: number, data: IProfileRating) => {
  const profile = await models.Profile.findByPk(profileId);
  if (!profile) throw new Error('Profile not found.');
  if (profile.get('user_id') !== userId) throw new Error('You can not update this profile rating.');

  const result = ClientRatingSchema.validate(data);

  if (result.error) throw new Error(result.error.message);

  const rating = await models.ProfileRating.findOne({ where: { profile_id: profileId } });

  if (!rating) {
    return await createClientRating(profileId, userId, data);
  }

  await rating.update(data);

  return rating;
};

export const createClientRating = async (profileId: string, userId: number, data: IProfileRating) => {
  const rating = await models.ProfileRating.create({ ...data, profile_id: profileId });
  return rating;
};
