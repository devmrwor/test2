import { models } from '@lib/db';

export const incrementProfileViews = async (id: number) => {
  const profileStatistic = await models.ProfileStatistic.findOne({
    where: {
      profile_id: id,
    },
  });

  if (profileStatistic) {
    await profileStatistic.increment('views');
  } else {
    await models.ProfileStatistic.create({
      profile_id: id,
      views: 1,
    });
  }
};

export const createProfileStatistic = (profile_id: number) => {
  return models.ProfileStatistic.create({
    profile_id,
    views: 0,
  });
};
