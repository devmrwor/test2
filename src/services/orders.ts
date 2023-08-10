import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiRoutes, OrderRoutes } from '../../common/enums/api-routes';
import { IOrder } from '../../common/types/order';
import { IPaginationResponse } from '../../common/types/pagination-response';
import { SortOrders } from '../../common/enums/sort-order';
import { OrderStatuses } from '../../common/enums/order-statuses';

export async function getCustomerOrders(
  page: number,
  limit: number,
  filter: OrderStatuses,
  userId: string,
  sortOrder?: SortOrders
): Promise<IPaginationResponse<IOrder>> {
  const url = new URL(uniteApiRoutes([ApiRoutes.ORDERS, OrderRoutes.CUSTOMER, userId]));

  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
    status: filter,
    sortOrder: sortOrder ?? 'null',
  };

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  const ordersRes = await fetch(url.toString());

  if (!ordersRes.ok) throw new Error('Error fetching data');

  const ordersData = await ordersRes.json();

  return ordersData;
}

export const createOrder = async (order: IOrder): Promise<IOrder> => {
  const url = new URL(uniteApiRoutes([ApiRoutes.ORDERS]));

  const res = await fetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Error creating order');

  const data = await res.json();

  return data;
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  const url = new URL(uniteApiRoutes([ApiRoutes.ORDERS, orderId]));

  const res = await fetch(url.toString(), {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Error deleting order');
};
