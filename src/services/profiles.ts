import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiProfileRoutes, ApiRoutes, UserRoutes } from '../../common/enums/api-routes';
import { CustomerTypes } from '../../common/enums/customer-type';
import { IPaginationResponse } from '../../common/types/pagination-response';
import { IProfile } from '../../common/types/profile';
import { MessengerItem } from '../../common/types/messenger';
import { SortOrders } from '../../common/enums/sort-order';

export async function getProfiles(
  page: number,
  limit: number,
  route: UserRoutes,
  customerType: CustomerTypes,
  searchText: string = '',
  sortOrder?: SortOrders,
  sortField?: string,
  profile_language?: string
): Promise<IPaginationResponse<IProfile>> {
  const url = new URL(
    uniteApiRoutes([ApiRoutes.PROFILES, route === UserRoutes.CUSTOMERS ? ApiProfileRoutes.CUSTOMERS : ''])
  );

  const params: Record<string, string | undefined> = {
    page: page.toString(),
    limit: String(limit),
    customerType,
    searchText,
    sortOrder: sortOrder,
    sortField: sortField,
    profile_language: profile_language,
  };

  Object.keys(params).forEach((key) => params[key] && url.searchParams.append(key, params[key]));

  const profileRes = await fetch(url.toString());

  if (!profileRes.ok) throw new Error('Error fetching data');

  const profileData = await profileRes.json();

  return profileData;
}

export async function getUserProfiles(
  page: number,
  limit: number,
  userId: string,
  language?: string
): Promise<IPaginationResponse<IProfile>> {
  const url = new URL(uniteApiRoutes([ApiRoutes.PROFILES, ApiProfileRoutes.USER, userId], { language }));
  console.log(url);

  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  const profileRes = await fetch(url.toString());

  if (!profileRes.ok) throw new Error('Error fetching data');

  const profileData = await profileRes.json();

  return profileData;
}

export const getProfile = async (id: string): Promise<IProfile> => {
  const profileRes = await fetch(uniteApiRoutes([ApiRoutes.PROFILES, id]));

  if (!profileRes.ok) throw new Error('Error fetching data');

  const profile = await profileRes.json();

  return profile;
};

export const toggleMessenger = async (
  profileId: number,
  messengerId: number,
  nickname: string
): Promise<MessengerItem> => {
  const profileRes = await fetch(
    uniteApiRoutes([ApiRoutes.PROFILES, ApiProfileRoutes.MESSENGERS, profileId], {
      messengerId,
      nickname,
    }),
    {
      method: 'PATCH',
    }
  );

  if (!profileRes.ok) throw new Error('Error fetching data');

  const profile = await profileRes.json();

  return profile;
};

export const addMessengersToProfile = async (profileId: number, data: MessengerItem[]): Promise<MessengerItem> => {
  const profileRes = await fetch(uniteApiRoutes([ApiRoutes.PROFILES, ApiProfileRoutes.MESSENGERS, profileId]), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!profileRes.ok) throw new Error('Error fetching data');

  const profile = await profileRes.json();

  return profile;
};

export const deleteProfileById = async (id: string): Promise<void> => {
  const profileRes = await fetch(uniteApiRoutes([ApiRoutes.PROFILES, id]), {
    method: 'DELETE',
  });

  if (!profileRes.ok) throw new Error('Error deleting profile');

  return;
};

export const deleteProfilesByIds = async (ids: string[]): Promise<void> => {
  const allRequests = ids.map((id) => {
    return fetch(uniteApiRoutes([ApiRoutes.PROFILES, id]), {
      method: 'DELETE',
    });
  });

  await Promise.all(allRequests);
};

export const createProfile = async (data: IProfile): Promise<IProfile> => {
  const profileRes = await fetch(uniteApiRoutes([ApiRoutes.PROFILES, ApiProfileRoutes.COPY]), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!profileRes.ok) throw new Error('Error creating profile');

  const profile = await profileRes.json();

  return profile;
};
