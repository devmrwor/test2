import { i18n, useTranslation } from 'next-i18next';
import Image from 'next/image';
import telegram from '@/components/Footer/components/Bottom/telegram.svg';
import facebook from '@/components/Footer/components/Bottom/facebook.svg';
import instagram from '@/components/Footer/components/Bottom/instagram.svg';
import Link from 'next/link';
import { ExpandMore } from '@mui/icons-material';
import { MenuItem, Select, Stack } from '@mui/material';
import { Languages } from 'common/enums/languages';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { PrivacyPolicyBtn } from '@/components/Footer/components/Bottom/PrivacyPolicyBtn';
import { PublicOfferBtn } from '@/components/Footer/components/Bottom/PublicOfferBtn';

export const Bottom = () => {
  const { t } = useTranslation();
  const selectRef = useRef<HTMLSelectElement>(null);
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <div className="flex flex-col gap-y-6 px-3.25 pt-6 pb-25 text-white bg-primary-100">
      {/*<Image src={logo} alt={t('footer.logo')} />*/}

      <section className="flex flex-col space-y-elGapY">
        <h5>{t('footer.social_nets')}</h5>
        <div className="flex space-x-ftrGapX">
          <a href="/" target="_blank" aria-label={t('footer.telegram')}>
            <Image src={telegram} alt={t('footer.telegram')} />
          </a>
          <a href="/" target="_blank" aria-label={t('footer.facebook')}>
            <Image src={facebook} alt={t('footer.facebook')} />
          </a>
          <a href="/" target="_blank" aria-label={t('footer.instagram')}>
            <Image src={instagram} alt={t('footer.instagram')} />
          </a>
        </div>
      </section>

      <section className="flex flex-col space-y-elGapY items-start" aria-label={t('footer.contacts_policies')}>
        <p>
          Email:{' '}
          <a className="underline" href={`mailto:${t('email_address')}`}>
            {t('email_address')}
          </a>
        </p>

        <Link href="/" className="underline">
          {t('footer.support')}
        </Link>
        <PublicOfferBtn />
        <PrivacyPolicyBtn />
      </section>

      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',

          '& .MuiInputBase-input': {
            color: 'white !important',
          },
          '& .MuiInput-underline::before': {
            border: '0 !important',
          },
        }}
      >
        &copy; Idea GIC s.r.o.
        <Select
          ref={selectRef}
          className="relative z-10 text-white"
          variant="standard"
          id="language"
          value={i18n.language}
          onChange={(e) => {
            changeLanguage(e.target.value as string);
          }}
          IconComponent={() => (
            <div className="absolute top-1 right-0 z-0 cursor-pointer pointer-events-none text-white">
              <ExpandMore fontSize="medium" />
            </div>
          )}
        >
          <MenuItem className="text-white" value={Languages.EN}>
            En
          </MenuItem>
          <MenuItem className="text-white" value={Languages.RU}>
            Ru
          </MenuItem>
        </Select>
      </Stack>
    </div>
  );
};
