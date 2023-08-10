import React from 'react';
import Image from 'next/image';
import face from 'public/assets/images/Face_man_1.svg';
import { ChatMessage } from '../../../common/types/chat-item';
import dayjs from 'dayjs';
import { useChatContext } from '@/contexts/chatContext';

interface UserMessageProps {
  user: 'companion' | 'owner';
  message: ChatMessage;
}

export function UserMessage({ user = 'companion', message }: UserMessageProps) {
  const time = dayjs(message.created_at).format('HH:mm');
  const { getAvatarSrc } = useChatContext();

  return (
    <div className={`flex items-start gap-2 shrink-0 ${user === 'owner' && 'flex-row-reverse self-end'}`}>
      {user === 'companion' && <Image onErrorCapture={face} src={getAvatarSrc(face)} width={30} height={30} alt="logo" />}
      <div
        className={`p-2.75 text-sm rounded-md text-text-primary ${
          user === 'owner' ? ' bg-primary-200' : 'bg-background'
        }`}
      >
        {message.text}
      </div>
      <time className="self-end text-sm text-text-secondary">{time}</time>
    </div>
  );
}
