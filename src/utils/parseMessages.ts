import { ChatMessage } from '../../common/types/chat-item';

export const parseMessages = (messages: ChatMessage[]) => {
  const parsedMessages = messages.reduce((acc: Record<string, ChatMessage[]>, message: ChatMessage) => {
    const date = getParsedDate(String(message.created_at));

    if (!acc[date]) {
      acc[date] = [message];
    } else {
      acc[date].push(message);
    }

    return acc;
  }, {});

  return parsedMessages;
};

export const getParsedDate = (date: string) => {
  return new Date(date).toISOString().split('T')[0];
};
