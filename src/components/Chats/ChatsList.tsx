import { Chat } from '../../../common/types/chat';
import ChatItem from './ChatItem';
import { Roles } from '../../../common/enums/roles';
import { useTranslation } from 'next-i18next';

interface ChatListProps {
  chats: Chat[];
  userType: Roles;
}

export const ChatsList = ({ chats, userType }: ChatListProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 mb-14">
      {chats?.length ? (
        chats.map((chat) => <ChatItem key={chat.id} chat={chat} userType={userType} />)
      ) : (
        <h3 className="text-text-primary text-lg">{t('no_chats')}</h3>
      )}
    </div>
  );
};
