import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Chat, ClientChat } from '../../common/types/chat';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { IUser } from '../../common/types/user';
import { ChatMessage } from '../../common/types/chat-item';
import { getParsedDate, parseMessages } from '@/utils/parseMessages';

interface ChatContextValue {
  chat: Chat | undefined;
  userData: IUser | undefined;
  lastMessage: ChatMessage | undefined;
  setChat: Dispatch<SetStateAction<Chat | undefined>>;
  getAvatarSrc: (defaultImage: string) => string;
  getSenderName: () => string;
  addMessage: (message: ChatMessage) => void;
  addMessages: (messages: ChatMessage[]) => void;
}
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { t } = useTranslation();
  const { data } = useSession();
  const [chat, setChat] = useState<Chat | undefined>(undefined);

  const lastMessage = useMemo(() => chat && chat.messages.at(-1), [chat]);

  const userData = chat?.executor_id !== data?.user?.id ? chat?.executor : chat?.customer;

  const getAvatarSrc = (defaultImage: string) => {
    if (userData?.photo) return userData.photo;
    return defaultImage;
  };

  const getSenderName = () => {
    if (!userData) return t('anonymous');
    const name = `${userData.name} ${userData.surname ? userData.surname?.slice(0, 1) + '.' : ''}`;
    return name;
  };

  const addMessage = (message: ChatMessage) => {
    if (!chat) return;

    setChat((prev) => {
      return prev
        ? {
            ...prev,
            messages: [...prev.messages, message],
          }
        : prev;
    });
  };

  const addMessages = (messages: ChatMessage[]) => {
    setChat((prev) => {
      return prev
        ? {
            ...prev,
            messages: [...prev.messages, ...messages],
          }
        : prev;
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        userData,
        lastMessage,
        setChat,
        getAvatarSrc,
        getSenderName,
        addMessage,
        addMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('chatContext must be used within a ChatProvider');
  }
  return context;
};
