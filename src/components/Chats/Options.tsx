import { useTranslation } from 'next-i18next';
import { Box } from '@mui/material';

export default function Options() {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 my-4">
      <button className="text-sm py-0.5 px-[8px] rounded-md border bg-primary-100 text-white p-px border-primary-100">
        {t('chats_content.all')}
      </button>
      <div className="relative">
        <button className="text-sm py-0.5 px-[8px] rounded-md border text-text-secondary border-text-secondary">
          {t('chats_content.unread')}
        </button>
        <Box
          sx={{
            position: 'absolute',
            top: '-5px',
            right: '5px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'red',
          }}
        ></Box>
      </div>
    </div>
  );
}
