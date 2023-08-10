import { uniteApiRoutes } from '@/utils/uniteRoute';
import { IPaginationResponse } from '../../common/types/pagination-response';
import { ApiRoutes } from '../../common/enums/api-routes';
import { NotificationTypes } from '../../common/enums/notification-types';
import { INotification } from '../../common/types/notification';
import { SortOrders } from '../../common/enums/sort-order';

export const getNotifications = async (
  page: number,
  limit: number,
  type: NotificationTypes,
  sortField: string,
  sortOrder: SortOrders
) => {
  const url = new URL(uniteApiRoutes([ApiRoutes.NOTIFICATIONS]));

  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
    type,
    sortField,
    sortOrder,
  };

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  const response = await fetch(url.toString());

  if (!response.ok) throw new Error('Error fetching data');

  const data = await response.json();

  return data;
};

export const deleteNotification = async (id: number) => {
  const response = await fetch(uniteApiRoutes([ApiRoutes.NOTIFICATIONS, id]), {
    method: 'DELETE',
  });

  console.log(response);
  if (!response.ok) throw new Error('Error deleting data');

  const data = await response.json();

  return data;
};

export const createNotification = async (data: INotification) => {
  const response = await fetch(uniteApiRoutes([ApiRoutes.NOTIFICATIONS]), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error creating data');

  console.log(response);

  const responseData = await response.json();

  return responseData;
};

export const updateNotification = async (id: string, data: INotification) => {
  const response = await fetch(uniteApiRoutes([ApiRoutes.NOTIFICATIONS, id]), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Error updating data');

  const responseData = await response.json();

  return responseData;
};

export const getNotificationById = async (id: string) => {
  const response = await fetch(uniteApiRoutes([ApiRoutes.NOTIFICATIONS, id]));

  if (!response.ok) throw new Error('Error fetching data');

  const data = await response.json();

  return data;
};
