import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import messageIcon from '@/pages/client/artur/chat/components/Message.png';
import { Box } from '@mui/material';

export default function EmptyMessage() {
  const { t } = useTranslation();

  return (
    <Box
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      sx={{
        right: '-10px',
        top: '0',
        display: 'flex',
        flexDirection: 'column',
        rowGap: '10px',
        alignItems: 'center',
      }}
    >
      <Image src={messageIcon} width={108} height={91} alt="message" />
      <p className="text-text-secondary text-center text-sm">{t('chats_content.answers_in_time')}</p>
    </Box>
  );
}
