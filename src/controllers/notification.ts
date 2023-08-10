import { models } from '@lib/db';
import { NotificationTypes } from '../../common/enums/notification-types';
import { INotification } from '../../common/types/notification';
import { Op, Order } from 'sequelize';
import { SortOrders } from '../../common/enums/sort-order';

export const deleteNotifications = async (id: string) => {
  console.log('id', id);
  await models.Notification.destroy({ where: { id } });
  return 'Notification deleted successfully.';
};

export const getNotifications = async (
  page: number,
  limit: number,
  type: NotificationTypes,
  sortField: string,
  sortOrder: SortOrders
) => {
  const offset = Math.max(0, (page - 1) * limit);
  const where: Record<string, any> = {};

  if (type === NotificationTypes.FOR_CUSTOMER) {
    where['status'] = {
      [Op.or]: [NotificationTypes.FOR_CUSTOMER, NotificationTypes.FOR_ALL],
    };
  }

  if (type === NotificationTypes.FOR_EXECUTOR) {
    where['status'] = {
      [Op.or]: [NotificationTypes.FOR_EXECUTOR, NotificationTypes.FOR_ALL],
    };
  }

  const order: Order = [];

  const fields = {
    id: 'sort_order',
    date: 'created_at',
    page: 'displaying_page',
  };

  const field = fields[sortField] || 'sort_order';
  const dir = sortOrder === SortOrders.ASC ? SortOrders.ASC : SortOrders.DESC;

  order.push([field, dir]);

  const notifications = await models.Notification.findAndCountAll({
    where,
    limit,
    offset,
    order,
  });
  return notifications;
};

export const createNotifications = async (data: INotification) => {
  const notifications = await models.Notification.create(data);
  return notifications;
};

export const updateNotifications = async (id: string, data: INotification) => {
  const notifications = await models.Notification.update(data, { where: { id } });
  return notifications;
};

export const getNotificationById = async (id: string) => {
  const notifications = await models.Notification.findOne({ where: { id } });
  return notifications;
};
