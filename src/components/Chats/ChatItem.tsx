import Image from 'next/image';
import face from 'public/assets/images/Face_man_1.svg';
import { Box } from '@mui/material';
import { ClientRoutes } from '../../../common/enums/api-routes';
import Link from 'next/link';
import { uniteRoutes } from '@/utils/uniteRoute';
import { Chat } from '../../../common/types/chat';
import { useTranslation } from 'next-i18next';
import { Roles } from '../../../common/enums/roles';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { SenderType } from '../../../common/enums/messages';
import classNames from 'classnames';
import { clipLength } from '@/utils/strings';

dayjs.extend(weekday);

interface ChatItemProps {
  chat: Chat;
  userType: Roles;
}

export default function ChatItem({ chat, userType }: ChatItemProps) {
  const { t, i18n } = useTranslation();

  const lastMessage = chat?.messages?.at(-1);
  const date = lastMessage ? dayjs(lastMessage.created_at).locale(i18n.language).format('dddd') : '';
  const user = userType === Roles.CUSTOMER ? chat?.executor : chat?.customer;

  const getSenderName = () => {
    if (!chat) return t('anonymous');
    const name = `${user.name} ${user.surname ? user.surname?.slice(0, 1) + '.' : ''}`;
    return name;
  };

  const getAvatarSrc = () => {
    if (user?.photo) return user.photo;
    return face;
  };

  const getIsActive = () => {
    if (!user || !user.last_active) return false;

    const currentTime = dayjs();
    const lastActiveTime = dayjs(user.last_active);
    const minutesDifference = currentTime.diff(lastActiveTime, 'minutes');
    return minutesDifference <= 5;
  };

  const isActive = getIsActive();

  return (
    <Link href={uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.CHAT, chat.id])}>
      {lastMessage && (
        <div className="flex h-full gap-2 items-start w-full relative">
          {/* FIXME: cannot set size of photon with tailwind */}
          <div className="relative">
            <Image height={30} width={30} className="rounded" src={getAvatarSrc()} alt="avatar" />
            <div
              className={classNames(
                `rounded-full absolute -bottom-1 -right-1 w-2 h-2`,
                isActive ? 'bg-green-100' : 'bg-yellow-500'
              )}
            />
          </div>
          <div className="w-full">
            <div className="flex w-full items-baseline justify-between">
              <div className="text-lg text-text-primary capitalize">{getSenderName()}</div>
              <div className="text-text-secondary capitalize">{date}</div>
            </div>
            <Box
              sx={{
                lineHeight: 'normal',
                color: '#000000',
              }}
            >
              {clipLength(lastMessage.type === SenderType.SYSTEM ? t(lastMessage?.text) : lastMessage?.text, 50)}
            </Box>
          </div>
        </div>
      )}
    </Link>
  );
}
