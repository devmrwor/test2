import { Box } from '@mui/material';
import { ChatMessage } from './ChatMessage';
import { DateDivider } from './DateDivider';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { useChatContext } from '@/contexts/chatContext';
import { height } from '@mui/system';
import { parseMessages } from '@/utils/parseMessages';

export const ChatList = () => {
  const chatListRef = useRef<HTMLDivElement>(null);
  const { chat } = useChatContext();

  const messages = useMemo(() => (chat ? parseMessages(chat?.messages) : {}), [chat]);

  useEffect(() => {
    if (!chatListRef.current) return;
    const chatList = chatListRef.current;
    chatList?.scrollTo({
      top: chatList.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <Box
      ref={chatListRef}
      className="flex flex-col p-2.75 gap-3"
      sx={{
        position: 'relative',
        borderTop: '1px solid #dbdbdb',
        borderBottom: '1px solid #dbdbdb',
        overflowY: 'auto',
        flex: '1',
      }}
    >
      <div style={{ height: chatListRef.current?.clientHeight }}></div>
      {/* <IntroMessage />
        {messages.length === 0 ? (
          <EmptyMessage />
        ) : (
          <>
            <div className="text-text-secondary text-center">15 Октября 2023</div>
            <Message user="owner" />
            <div className="text-text-secondary text-center">15 Октября 2023</div>
            <Message user="companion" />
            <Message user="companion" />
          </>
        )}
         */}

      {messages &&
        Object.keys(messages).map((date) => (
          <Fragment key={date}>
            <DateDivider date={date} />
            {messages[date].map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </Fragment>
        ))}
    </Box>
  );
};
