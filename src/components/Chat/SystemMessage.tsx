import React from 'react';
import Image from 'next/image';
import chatLogo from 'public/chatLogo.png';
import { useTranslation } from 'next-i18next';
import { ChatMessage } from '../../../common/types/chat-item';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faPlus } from '@fortawesome/free-solid-svg-icons';

interface SystemMessageProps {
  message: ChatMessage;
}

export default function SystemMessage({ message }: SystemMessageProps) {
  const { t } = useTranslation();
  const time = dayjs(message.created_at).format('HH:mm');

  return (
    <div className="flex items-start gap-2">
      <div className="w-7.5 h-7.5 shrink-0">
        <Image src={chatLogo} width={30} height={30} alt="logo" />
      </div>
      <div className="p-2.75 bg-green-50 rounded-md  text-text-primary">
        {t(message.text)}
        {message.text === 'system_customer_first_order_message' && (
          <>
            {' '}
            <FontAwesomeIcon icon={faPlus} className="text-primary-100" /> {t('and')}{' '}
            <FontAwesomeIcon className="text-primary-100" icon={faHandshake} />{' '}
          </>
        )}
      </div>
      <time className="self-end text-sm text-text-secondary">{time}</time>
    </div>
  );
}
