import { models } from '@lib/db';
import { Model, Op } from 'sequelize';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../common/constants/categoriesPagination';
import { FeedbackRoutes } from '../../common/enums/api-routes';
import { OrderStatuses } from '../../common/enums/order-statuses';
import { Roles } from '../../common/enums/roles';
import { IFeedback } from '../../common/types/feedback';
import { getOrder } from './order';
import { getProfileById } from './profile';

export async function createFeedback(userId: number, data: IFeedback): Promise<Model<IFeedback>> {
  const order = await getOrder(data.order_id);
  if (order.get('status') !== OrderStatuses.COMPLETED) {
    throw new Error('Order is not completed');
  }
  if (!order) {
    throw new Error(`Order with ID ${data.order_id} not found.`);
  }

  return models.Feedback.create({ ...data, user_id: userId });
}

export async function createExecutorFeedback(profileId: number, userId: number, data: IFeedback) {
  const profile = await getProfileById(profileId);

  if (profile.get('user_id') !== userId) {
    throw new Error('You do not have access to do this feedback');
  }

  return models.Feedback.create({ ...data, profile_id: profileId, user_id: userId });
}

export async function getFeedback(id: number): Promise<Model<IFeedback>> {
  const feedback = await models.Feedback.findByPk(id);
  if (!feedback) {
    throw new Error(`Feedback with ID ${id} not found.`);
  }

  return feedback;
}

export async function getAllFeedbacks(
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  feedbackType: FeedbackRoutes,
  userId: number
): Promise<IFeedback> {
  const offset = Math.max(0, (page - 1) * limit);

  const where: Record<string, any> = {};

  if (feedbackType === FeedbackRoutes.ME) {
    where['profile_id'] = { [Op.eq]: userId };
  }
  if (feedbackType === FeedbackRoutes.MY) {
    where['user_id'] = { [Op.eq]: userId };
  }

  const feedbacksData = await models.Feedback.findAndCountAll({
    include: models.User,
    where,
    limit,
    offset,
  });

  return feedbacksData as any;
}

export async function updateFeedback(
  id: number,
  userId: number,
  role: Roles,
  data: Partial<IFeedback>
): Promise<Model<IFeedback>> {
  const feedback = await getFeedback(id);
  if (feedback.get('user_id') !== userId || role !== Roles.ADMIN) {
    throw new Error('You do not have access to do this feedback');
  }
  return feedback.update(data);
}

export async function deleteFeedback(id: number, userId: number): Promise<void> {
  const feedback = await getFeedback(id);

  if (feedback.get('user_id') !== userId) {
    throw new Error('You do not have access to do this feedback');
  }

  await feedback.destroy();
}

export async function getFeedbacksByUserId(id: number): Promise<IFeedback[]> {
  const feedbacks = await models.Feedback.findAll({ where: { user_id: id } });
  return feedbacks.map((feedback) => feedback.get());
}

export async function getFeedbacksByProfileId(id: number): Promise<IFeedback[]> {
  const feedbacks = await models.Feedback.findAll({ where: { profile_id: id } });
  return feedbacks.map((feedback) => feedback.get());
}
