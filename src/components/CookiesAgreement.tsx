// @ts-nocheck
import { useTranslation } from 'next-i18next';
import { Stack, Link as MUILink } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';

const lsKey = 'vvvv-cookies-agreement';

export const CookiesAgreement = () => {
  const { t } = useTranslation();
  const [agreed, setAgreed] = useState<string | null>('agreed');
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const onPageLoad = () => {
      setAgreed(localStorage.getItem(lsKey));
      setTimeout(() => setShow(true), 2000);
    };

    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  function processPolicyAcceptance() {
    localStorage.setItem(lsKey, 'agreed');
    setAgreed('agreed');
  }

  // TODO: add link href policy
  return (
    agreed === null &&
    show && (
      <Stack
        className="text-white"
        sx={{
          minWidth: '300px',
          left: '50%',
          right: 'auto',
          transform: 'translate(-50%)',
          bottom: '5px',
          // marginTop: 'auto',
          padding: '10px',
          position: 'fixed',
          zIndex: '500',
          backgroundColor: '#33a1c9',
          borderRadius: '15px',
        }}
      >
        <div className="text-white text-sm">
          {t('cookiePolicy.message')}{' '}
          <MUILink
            component={Link}
            href="/"
            sx={{ color: '#dcf2fc', textDecorationColor: '#dcf2fc !important', fontSize: '14px' }}
          >
            {t('cookiePolicy.link')}
          </MUILink>
        </div>
        <button
          onClick={processPolicyAcceptance}
          className="m-auto bg-white text-primary-100 rounded drop-shadow-lg mt-6 mb-3 w-cookiesBtn h-cookiesBtn "
        >
          {t('cookiePolicy.buttonText')}
        </button>
      </Stack>
    )
  );
};
