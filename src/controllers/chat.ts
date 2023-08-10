import { models } from '@lib/db';
import { IOrder } from '../../common/types/order';
import { Includeable, Model, Op } from 'sequelize';
import { Roles } from '../../common/enums/roles';
import { ChatMessage } from '../../common/types/chat-item';
import { SenderType } from '../../common/enums/messages';
import { Chat } from '../../common/types/chat';

export const getChatById = async (userId: number, chatId: number, filter?: Record<string, any>) => {
  const where: Record<string, any> = {};

  where['show_to'] = {
    [Op.or]: [userId, null],
  };

  if (filter?.from_date) {
    where['created_at'] = {
      [Op.gt]: filter.from_date,
    };
  }

  const includeMessages: Includeable = {
    model: models.ChatMessage,
    as: 'messages',
    required: false,
    order: [[models.ChatMessage, 'created_at', 'DESC']],
    where,
  };

  const includeCustomer: Includeable = {
    model: models.User,
    as: 'executor',
    required: false,
  };

  const includeExecutor: Includeable = {
    model: models.User,
    as: 'customer',
    required: false,
  };

  const chat = await models.Chat.findByPk(chatId, {
    include: [includeMessages, includeCustomer, includeExecutor],
  });

  if (!chat) {
    return chat;
  }

  if (!(chat.get('customer_id') === userId || chat.get('executor_id') === userId)) {
    throw new Error('You do not have access to this chat');
  }

  return chat.get();
};

export const getChatByOrderId = async (userId: number, orderId: number) => {
  const chat = await models.Chat.findOne({
    where: {
      order_id: orderId,
      executor_id: userId,
    },
  });

  if (!chat) {
    return chat;
  }

  // TODO add logic to make messages seen

  return chat.get();
};

export const createChat = async (userId: number, order: IOrder) => {
  const chat: Model<Chat> = await models.Chat.create({
    executor_id: userId,
    order_id: order.id,
    customer_id: order.customer_id,
  });

  const customerMessage = await createSystemMessage(chat.get('id'), {
    text: 'system_customer_first_order_message',
    show_to: order.customer_id,
  });

  const executorMessage = await createSystemMessage(chat.get('id'), {
    text: 'system_first_order_message',
    show_to: userId,
  });

  if (!customerMessage || !executorMessage) {
    throw new Error('Could not create system message');
  }

  const newChat = chat.get();

  return {
    ...newChat,
    messages: [customerMessage.get(), executorMessage.get()],
  };
};

export const getChatsByUserId = async (userId: number, role: Roles = Roles.CUSTOMER) => {
  const includeOrder: Includeable = {
    model: models.Order,
    as: 'order',
    required: false,
  };

  const includeCustomer: Includeable = {
    model: models.User,
    as: 'executor',
    required: false,
  };

  const includeExecutor: Includeable = {
    model: models.User,
    as: 'customer',
    required: false,
  };

  const includeMessage: Includeable = {
    model: models.ChatMessage,
    as: 'messages',
    required: false,
    limit: 1,
    where: {
      sender_id: {
        [Op.or]: [
          {
            [Op.ne]: userId,
          },
          null,
        ],
      },
      show_to: {
        [Op.or]: [userId, null],
      },
    },
    order: [['created_at', 'DESC']],
  };

  const where = role === Roles.EXECUTOR ? { executor_id: userId } : { customer_id: userId };

  const chats = await models.Chat.findAll({
    where,
    include: [includeOrder, includeCustomer, includeExecutor, includeMessage],
  });

  return chats.map((chat) => chat.get());
};

export const getChatUpdatesByUserId = async (userId: number, timestamp: number) => {
  const where = {
    [Op.or]: [{ executor_id: userId }, { customer_id: userId }],
    created_at: {
      [Op.gt]: new Date(timestamp),
    },
  };

  const chats = await models.Chat.findAll({
    where,
    order: [['created_at', 'DESC']],
  });

  return chats;
};

export const getChatUpdatesById = async (userId: number, chatId: number, filter: Record<string, any>) => {
  const chat = await getChatById(userId, chatId, filter);

  return chat;
};

export const getIsAllowedToMessage = async (chat_id: number) => {
  const chat = await models.Chat.findByPk(chat_id);

  if (!chat) {
    throw new Error('Chat not found');
  }

  const customerMessage = await models.ChatMessage.findOne({
    where: {
      chat_id,
      sender_id: chat.get('customer_id'),
    },
  });

  if (customerMessage) {
    return true;
  }

  const executorMessage = await models.ChatMessage.findOne({
    where: {
      chat_id,
      sender_id: chat.get('executor_id'),
    },
  });

  if (executorMessage) {
    return false;
  }

  return true;
};

export const createUserMessage = async (chat_id: number, sender_id: number, data: ChatMessage) => {
  const chat: Model<Chat> | null = await models.Chat.findByPk(chat_id);

  if (!chat) {
    throw new Error('Chat not found');
  }

  if (chat.get('executor_id') === sender_id) {
    const isAllowed = await getIsAllowedToMessage(chat_id);
    if (!isAllowed) {
      throw new Error('You are not allowed to send more than one message before customer responds');
    }
  }

  const message = models.ChatMessage.create({ ...data, chat_id, type: SenderType.USER, sender_id, seen: false });

  return message;
};

export const createSystemMessage = (chat_id: number, data: Partial<ChatMessage>) => {
  const message = models.ChatMessage.create({ ...data, chat_id, type: SenderType.SYSTEM, seen: false });

  return message;
};

export const updateMessageById = async (id: number, userId: number, data: Partial<ChatMessage>) => {
  const message = await models.ChatMessage.findByPk(id);

  if (!message) {
    throw new Error('Message not found');
  }

  if (message.get('sender') !== userId) {
    throw new Error("You can't update this message");
  }

  const updatedMessage = message.update({ ...data, sender: userId });

  return updatedMessage;
};

export const deleteMessageById = async (id: number, userId: number) => {
  const message = await models.ChatMessage.findByPk(id);

  if (!message) {
    throw new Error('Message not found');
  }

  if (message.get('sender') !== userId) {
    throw new Error("You can't delete this message");
  }

  await message.destroy();

  return 'message deleted successfully.';
};
