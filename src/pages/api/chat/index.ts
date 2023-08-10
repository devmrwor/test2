import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { IRequest } from '../../../../common/types/request';
import { OrderStatuses } from '../../../../common/enums/order-statuses';
import { createChat, getChatById, getChatByOrderId, getChatsByUserId } from '@/controllers/chat';
import { getOrderById } from '@/controllers/order';
import { Roles } from '../../../../common/enums/roles';
import { uniteRoutes } from '@/utils/uniteRoute';
import { ClientRoutes } from '../../../../common/enums/api-routes';

const handler = nc<IRequest, NextApiResponse>();
handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const { id } = req.token;
    const { role } = req.query;

    const chats = await getChatsByUserId(id, role as Roles);

    res.status(200).json(chats);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.post(async (req, res) => {
  try {
    const { id } = req.token;
    const { order_id } = req.body;

    const order = await getOrderById(+(order_id as string));

    if (!order) {
      return res.status(400).json({
        message: 'Order not found',
      });
    }

    if (order.customer_id === id) {
      return res.status(400).json({
        message: 'You cannot create chat with yourself',
      });
    }

    if (order.status !== OrderStatuses.CREATED) {
      return res.status(400).json({
        message: 'You cannot create chat for this order',
      });
    }

    const chat = await getChatByOrderId(id, order.id);

    if (chat) {
      return res.status(200).json(chat);
      // return res.redirect(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.CHAT, chat.id]));
    }

    const newChat = await createChat(id, order);

    return res.status(201).json(newChat);
    // res.redirect(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.CHAT, newChat.id]));
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
