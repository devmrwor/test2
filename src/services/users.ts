import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiRoutes, ApiUsersRoutes } from '../../common/enums/api-routes';
import { Roles } from '../../common/enums/roles';
import { IPaginationResponse } from '../../common/types/pagination-response';
import { IUser } from '../../common/types/user';
import { Messenger, MessengerItem } from '../../common/types/messenger';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../common/constants/categoriesPagination';
import { SortOrders } from '../../common/enums/sort-order';

export async function getUsers(
  page: number,
  limit: number,
  filter: Roles,
  sortField: string,
  sortOrder: SortOrders
): Promise<IPaginationResponse<IUser>> {
  const url = new URL(uniteApiRoutes([ApiRoutes.USERS]));

  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
    filter,
    sortField,
    sortOrder,
  };

  Object.keys(params).forEach((key) => params[key] && url.searchParams.append(key, params[key]));

  const usersRes = await fetch(url.toString());

  if (!usersRes.ok) throw new Error('Error fetching data');

  const usersData = await usersRes.json();

  return usersData;
}

export const getUser = async (id: string): Promise<IUser> => {
  const userRes = await fetch(uniteApiRoutes([ApiRoutes.USERS, id]));
  console.log(userRes);
  if (!userRes.ok) throw new Error('Error fetching data');

  const user = await userRes.json();

  return user;
};

export const toggleIsBlockedUser = async (id: string): Promise<IUser> => {
  const userRes = await fetch(uniteApiRoutes([ApiRoutes.USERS, id]), {
    method: 'PATCH',
  });

  if (!userRes.ok) throw new Error('Error fetching data');

  const user = await userRes.json();

  return user;
};

export const getUserNotifications = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  userId: string
): Promise<IPaginationResponse<MessengerItem>> => {
  const notificationsRes = await fetch(
    uniteApiRoutes([ApiRoutes.USERS, ApiUsersRoutes.NOTIFICATIONS, userId], { page, limit })
  );

  if (!notificationsRes.ok) throw new Error('Error fetching data');

  const notifications = await notificationsRes.json();

  return notifications;
};

export const deleteUserById = async (id: string): Promise<{ message: string }> => {
  const userRes = await fetch(uniteApiRoutes([ApiRoutes.USERS, id]), {
    method: 'DELETE',
  });

  if (!userRes.ok) throw new Error('Error deleting user');

  const user = await userRes.json();

  return user;
};

export const deleteUsersByIds = async (ids: number[]): Promise<{ message: string }[]> => {
  return Promise.all(ids.map((id) => deleteUserById(String(id))));
};
