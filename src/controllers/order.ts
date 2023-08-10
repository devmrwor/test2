import { IOrder } from '../../common/types/order';
import { models } from '@lib/db';
import { Includeable, Model, Op, Order } from 'sequelize';
import { getProfileById } from './profile';
import { getCategoryById } from './category';
import { IPaginationResponse } from '../../common/types/pagination-response';
import { OrderStatuses } from '../../common/enums/order-statuses';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../common/constants/categoriesPagination';
import { Roles } from '../../common/enums/roles';
import { SortOrders } from '../../common/enums/sort-order';
import { createOrderStatistic } from './orderStatistic';
import { OrderGetControllerOptions } from '../../common/types/controller-options';

export async function createOrder(customer_id: number, data: IOrder): Promise<Model<IOrder>> {
  if (!data.category_id) {
    throw new Error(`category_id is required`);
  }

  await getCategoryById(data.category_id);

  const order = {
    ...data,
    customer_id,
    executor_id: null,
    profile_id: null,
    status: OrderStatuses.CREATED,
  };

  const newOrder = await models.Order.create(order);
  const order_id = newOrder.get('id') as number;

  await createOrderStatistic(order_id);
  return newOrder;
}

export async function getOrder(id: number): Promise<IOrder> {
  const includeStatistic: Includeable = {
    model: models.OrderStatistic,
    as: 'statistic',
  };

  const orderRes = await models.Order.findByPk(id, {
    include: [includeStatistic],
  });
  if (!orderRes) {
    throw new Error(`Order with ID ${id} not found.`);
  }
  const order = orderRes.get();

  return order;
}
export async function getOrderModel(id: number): Promise<Model<IOrder>> {
  const includeStatistic: Includeable = {
    model: models.OrderStatistic,
    as: 'statistic',
  };
  const includeUser: Includeable = {
    model: models.User,
    as: 'user',
  };

  const orderRes = await models.Order.findByPk(id, {
    include: [includeStatistic, includeUser],
  });
  if (!orderRes) {
    throw new Error(`Order with ID ${id} not found.`);
  }

  return orderRes;
}

export async function getAllOrders(): Promise<IOrder[]> {
  return models.Order.findAll().then((orders) => orders.map((order) => order.get()));
}

export async function updateOrder(id: number, userId: number, data: Partial<IOrder>): Promise<Model<IOrder>> {
  const order = await getOrderModel(id);
  if (!(order.get('customer_id') === userId || order.get('executor_id') === userId)) {
    throw new Error('You do not have access to change this order');
  }

  const { executor_id } = data;

  if (executor_id === userId) {
    throw new Error(`You can't order yourself`);
  }

  return order.update(data);
}

export async function deleteOrder(id: number, userId: number, role: Roles): Promise<string> {
  const order = await getOrderModel(id);

  if (order.get('customer_id') !== userId || role !== Roles.ADMIN) {
    throw new Error('You do not have access to remove this order');
  }
  await order.destroy();

  return 'deleted successfully';
}

export async function getOrdersPublic(options: OrderGetControllerOptions): Promise<IPaginationResponse<IOrder>> {
  return getOrders(options);
}
export async function getOrdersByCustomerId(
  id: number,
  { ...options }: OrderGetControllerOptions
): Promise<IPaginationResponse<IOrder>> {
  options.filter = {
    ...options.filter,
    customer_id: id,
  };

  return getOrders(options);
}

export async function getOrdersByExecutorId(
  id: number,
  { ...options }: OrderGetControllerOptions
): Promise<IPaginationResponse<IOrder>> {
  const profile = await getProfileById(id);

  options.filter = {
    ...options.filter,
    executor_id: id,
    profile_id: profile.get('id') as number,
  };

  return getOrders(options);
}

export async function getOrdersByUserId(
  id: number,
  { ...options }: OrderGetControllerOptions
): Promise<IPaginationResponse<IOrder>> {
  options.filter = {
    ...options.filter,
    executor_id: id,
  };

  return getOrders(options);
}

export async function getOrderById(id: number) {
  const order = await models.Order.findByPk(id);
  if (!order) {
    return order;
  }

  return order.get();
}

export async function getAndUpdateOrder(id: number, data: Partial<IOrder>) {
  const order = await models.Order.findByPk(id);
  if (!order) {
    return order;
  }

  await order.update(data);

  return order.get();
}

export async function getOrders({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  filter,
  sortField,
  sortOrder,
}: OrderGetControllerOptions) {
  const offset = Math.max(0, (page - 1) * limit);

  const order: Order = [];

  const fields = {
    date: 'created_at',
    orders: 'description',
    city: 'address',
    executor: 'executor',
    id: 'id',
    execution_date: 'execution_date',
  };
  // @ts-ignore
  const field = fields[sortField] || 'id';
  const dir = String(sortOrder).toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  if (field === 'executor') {
    order.push([{ model: models.Profile, as: 'executor' }, 'name', dir]);
  } else if (field === 'address') {
    order.push([{ model: models.Profile, as: 'executor' }, 'address', dir]);
  } else if (field === 'execution_date') {
    console.log('field', field);
    order.push(['date.startDate', dir]);
  } else {
    order.push([field, dir]);
  }

  if (field !== 'id') {
    order.push(['id', 'ASC']);
  }

  const where: Record<string, any> = {};

  if (Object.keys(filter).length) {
    const { highest_price, name, lowest_price, ...otherFilters } = filter;

    const allowedFields = [
      'status',
      'highest_price',
      'lowest_price',
      'payment_method',
      'category_id',
      'profile_id',
      'type',
      'customer_id',
      'executor_id',
    ];

    allowedFields.forEach((key) => {
      if (otherFilters[key]) {
        where[key] = otherFilters[key];
      }
    });

    if (name) {
      where['name'] = { [Op.iLike]: `%${name}%` };
    }

    if (highest_price && lowest_price) {
      where['price_to'] = {
        [Op.gte]: +lowest_price,
        [Op.lte]: +highest_price,
      };
    } else if (highest_price) {
      where['price_to'] = {
        [Op.lte]: +highest_price,
      };
    } else if (lowest_price) {
      where['price_to'] = {
        [Op.gte]: +lowest_price,
      };
    }
  }

  const includeExecutor: Includeable = {
    model: models.User,
    as: 'executor',
    required: false,
  };

  const includeStatistic: Includeable = {
    model: models.OrderStatistic,
    as: 'statistic',
    required: false,
  };

  const includeUser: Includeable = {
    model: models.User,
    as: 'user',
    required: false,
  };

  const ordersData = await models.Order.findAndCountAll({
    where,
    limit,
    offset,
    order,
    include: [includeExecutor, includeStatistic, includeUser],
  });

  return ordersData as any;
}

export async function getAllOrdersByProfileId(id: number): Promise<IOrder[]> {
  const orders = await models.Order.findAll({ where: { profile_id: id } });
  return orders.map((order) => order.get());
}

export async function getOrdersByStatus(status: string): Promise<IOrder[]> {
  const orders = await models.Order.findAll({ where: { status } });
  return orders.map((order) => order.get());
}
