import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { IRequest } from '../../../../../common/types/request';
import { createUserMessage, getChatById, getChatUpdatesById, getChatUpdatesByUserId } from '@/controllers/chat';
import { parseMessages } from '@/utils/parseMessages';

const handler = nc<IRequest, NextApiResponse>();
handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const { id } = req.token;
    const { isFirst, chatId, ...filter } = req.query;

    const chat = await getChatUpdatesById(id, +(chatId as string), filter);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

handler.post(async (req, res) => {
  try {
    const { id } = req.token;
    const { chatId } = req.query;

    const chat = await getChatById(id, +(chatId as string));

    if (!chat) {
      return res.status(400).json({
        message: 'Chat not found',
      });
    }

    if (id !== chat.customer_id && id !== chat.executor_id) {
      throw new Error('You do not have access to this chat');
    }
    const message = await createUserMessage(chat.id, id, req.body);

    res.status(200).json(message);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
