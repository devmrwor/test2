import nc from 'next-connect';
import type { NextApiResponse } from 'next';
import checkAuth from '@/middlewares/checkAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { IRequest } from '../../../../../common/types/request';
import { getChatById } from '@/controllers/chat';

const handler = nc<IRequest, NextApiResponse>();
handler.use(checkAuth);

handler.get(async (req, res) => {
  try {
    const { id } = req.token;
    const { chatId } = req.query;

    const chat = await getChatById(id, +(chatId as string));

    if (!chat) {
      return res.status(400).json({
        message: 'Chat not found',
      });
    }
    // const messages = parseMessages(chat.messages);

    // res.status(200).json({ ...chat, messages });
    res.status(200).json(chat);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

export default handler;
