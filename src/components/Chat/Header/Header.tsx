import { ChevronLeftSolid } from '@/components/Icons/Icons';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import face from 'public/assets/images/Face_man_1.svg';
import Options from './Options';
import { useChatContext } from '@/contexts/chatContext';

export default function Header() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getSenderName, getAvatarSrc } = useChatContext();

  return (
    <div className="px-2.75 pt-2.75 pb-1 flex justify-between items-center">
      <button onClick={() => router.back()} className="flex items-center text-[28px]">
        <ChevronLeftSolid />
        <div className="text-base leading-7 ml-0.5 text-primary-100">{t('backward')}</div>
      </button>
      <div className="flex h-full gap-2 items-center">
        <Image
          onErrorCapture={face}
          width={30}
          height={30}
          className="rounded w-8.5 h-10.75 object-cover"
          src={getAvatarSrc(face)}
          alt="avatar"
          unoptimized
        />
        <div className="flex flex-col h-full justify-between">
          <div className="text-lg text-text-primary">{getSenderName()}</div>
          <div className="text-text-secondary text-sm hidden">Парикмахер</div>
        </div>
      </div>
      <Options />
    </div>
  );
}
