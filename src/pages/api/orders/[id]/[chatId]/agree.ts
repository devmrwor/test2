import { deleteOrder, getAndUpdateOrder, getOrder, getOrderById, updateOrder } from '@/controllers/order';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { IRequest } from '../../../../../../common/types/request';
import { createSystemMessage, getChatById } from '@/controllers/chat';
import { OrderStatuses } from '../../../../../../common/enums/order-statuses';

const handler = nextConnect<IRequest, NextApiResponse>();

handler.use(checkAuth);

handler.post(async (req, res) => {
  try {
    const { id: userId } = req.token;
    const { id, chatId } = req.query;

    const chat = await getChatById(userId, +(chatId as string));

    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
    }

    const order = await getAndUpdateOrder(+(id as string), {
      status: OrderStatuses.IN_PROGRESS,
      executor_id: chat.executor_id,
    });

    if (!order) {
      res.status(404).json({
        message: 'Order not found',
      });
    }

    if (order.customer_id !== userId) {
      res.status(403).json({ message: 'You do not have access to this order' });
    }

    const systemMessage = await createSystemMessage(+(chatId as string), {
      text: 'agree_customer_system_message',
      show_to: userId,
    });
    createSystemMessage(+(chatId as string), {
      text: 'agree_executor_system_message',
      show_to: chat.executor_id,
    });

    res.status(200).json(systemMessage.get());
  } catch (error) {
    res.status(400).json(getErrorMessage(error));
  }
});

export default handler;
