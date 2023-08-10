import { InputBase } from '@mui/material';
import Attachments from './Attachments';
import Image from 'next/image';
import send from './send.png';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiChatRoutes, ApiRoutes } from '../../../common/enums/api-routes';
import { toast } from 'react-toastify';
import { useChatContext } from '@/contexts/chatContext';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';

export const SendMessageForm = () => {
  const { t } = useTranslation();
  const { chat, addMessage } = useChatContext();
  const { data } = useSession();
  const [value, setValue] = useState('');

  const getIsFormDisabled = () => {
    if (!chat) return true;
    const messages = Object.values(chat?.messages || {}).flat();
    const userId = data?.user?.id;

    if (userId === chat?.customer_id) return false;
    const customerMessage = messages.find((message) => message.sender_id === chat.customer_id);

    if (customerMessage) return false;
    const executorMessage = messages.find((message) => message.sender_id === chat.executor_id);

    if (executorMessage) return true;
    return false;
  };

  const disabled = getIsFormDisabled();

  const sendMessage = async () => {
    try {
      if (!chat || disabled || !value) return;
      const body = JSON.stringify({ text: value });
      setValue('');
      const response = await fetch(uniteApiRoutes([ApiRoutes.CHAT, chat.id, ApiChatRoutes.MESSAGES]), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const data = await response.json();
      addMessage(data);
      return data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    if (disabled) return;
    setValue(e.target.value);
  };

  const keyDownHandler = (e) => {
    if (e.key === 'Enter' && !disabled) {
      sendMessage();
    }
  };

  return (
    <div className={classNames('flex justify-between items-center px-2 gap-2', disabled && 'grayscale')}>
      <Attachments disabled={disabled} />
      <InputBase
        onKeyDown={keyDownHandler}
        disabled={disabled}
        fullWidth
        size="medium"
        placeholder={t('write_message')}
        sx={{
          height: '42px',
        }}
        value={value}
        onChange={handleInputChange}
      />
      <button type="button" onClick={sendMessage}>
        <Image src={send} width={26} height={23} alt="send" />
      </button>
    </div>
  );
};
