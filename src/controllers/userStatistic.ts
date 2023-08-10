import { models } from '@lib/db';

export const createUserStatistic = (user_id: number) => {
  return models.ProfileStatistic.create({
    user_id,
  });
};
