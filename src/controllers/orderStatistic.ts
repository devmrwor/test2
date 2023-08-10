import { models } from '@lib/db';

export const incrementOrderViews = async (id: number) => {
  const orderStatistic = await models.OrderStatistic.findOne({
    where: {
      order_id: id,
    },
  });

  if (orderStatistic) {
    await orderStatistic.increment('views');
  } else {
    await models.OrderStatistic.create({
      order_id: id,
      views: 1,
    });
  }
};

export const createOrderStatistic = (order_id: number) => {
  return models.OrderStatistic.create({
    order_id,
    views: 0,
  });
};
