// @ts-nocheck
import { MenuItem, Select } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Languages } from '../../common/enums/languages';
import { ChatIcon, DropdownIcon, ProfileIcon } from './Icons/Icons';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import AdminBtn from '@/components/admin/header/AdminBtn';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const selectRef = useRef<HTMLSelectElement>(null);
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <header className="w-full bg-primary-100 items-center">
      <div className="flex justify-end ml-5 mr-8.75">
        <div className="flex justify-between gap-2 items-center">
          <Link href="#" className="flex flex-col items-center justify-center py-1 px-2 hover:bg-primary-900">
            <ChatIcon size="large" color="white" />
            <p className="text-white ">{t('chats')}</p>
          </Link>
          <AdminBtn onClick={() => console.log('sign out')} />
          <Select
            ref={selectRef}
            sx={{
              height: '100%',
              '&:before': {
                borderBottom: 'none!important',
              },
              '& .MuiSelect-select': {
                borderColor: 'transparent',
                color: '#fff',
                '&.MuiInputBase-input': {
                  paddingRight: '8px !important',
                },
              },
            }}
            className="hover:bg-primary-900 px-2"
            color="white"
            variant="standard"
            id="language"
            value={i18n.language}
            onChange={(e) => {
              console.log(e.target.value);
              changeLanguage(e.target.value as string);
            }}
            IconComponent={() => (
              <div className="top-3 right-1  pointer-events-none">
                <DropdownIcon fill="#fff" />
              </div>
            )}
          >
            <MenuItem value={Languages.EN}>En</MenuItem>
            <MenuItem value={Languages.RU}>Ru</MenuItem>
          </Select>
        </div>
      </div>
    </header>
  );
};
