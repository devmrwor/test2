import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ExecutorRatingForm, IProfileRating } from '../../common/types/profile-rating';
import { ApiProfileRoutes, ApiRoutes } from '../../common/enums/api-routes';

export const updateProfileRating = async (id: number, data: ExecutorRatingForm): Promise<IProfileRating> => {
  const ratingData: Partial<IProfileRating> = {
    provides_volunteer_assistance: data?.provides_volunteer_assistance ?? false,
    services_insured: data?.services_insured ?? false,
    secure_deal_available: data?.secure_deal_available ?? false,
  };

  const profileRes = await fetch(uniteApiRoutes([ApiRoutes.PROFILES, ApiProfileRoutes.RATING, id, ApiRoutes.MY]), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ratingData),
  });

  if (!profileRes.ok) throw new Error('Error fetching data');

  const profile = await profileRes.json();

  return profile;
};
