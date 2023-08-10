import { useSession } from 'next-auth/react';
import { SenderType } from '../../../common/enums/messages';
import { ChatMessage as IChatMessage } from '../../../common/types/chat-item';
import SystemMessage from './SystemMessage';
import { UserMessage } from './UserMessage';
import { Chat } from '../../../common/types/chat';

interface ChatMessageProps {
  message: IChatMessage;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { data } = useSession();
  const user = data?.user;
  const isOwner = user?.id === message.sender_id;

  if (message.type === SenderType.SYSTEM) {
    return <SystemMessage message={message} />;
  }

  return <UserMessage user={isOwner ? 'owner' : 'companion'} message={message}></UserMessage>;
};
