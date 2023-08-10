import { useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { FacebookIconRounded, ViberIcon, TelegramIcon, GoogleIconRounded } from '../Icons/Icons';
// @ts-ignore
export const LoginButtons = ({ telegramLogin = '', onGoogleSignIn, onFacebookSignIn }) => {
  const { t } = useTranslation();
  const telegramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!telegramRef.current) {
      return;
    }

    const script = document.createElement('script');

    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', telegramLogin);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '0');
    script.setAttribute('data-auth-url', '/auth/telegram');
    script.setAttribute('data-userpic', 'false');

    telegramRef.current.appendChild(script);

    return () => {
      telegramRef.current && telegramRef.current.removeChild(script);
    };
  }, [telegramRef]);

  return (
    // <div className="grid grid-cols-2 grid-rows-2 gap-x-3.5 gap-y-2.5">
    <div className=" gap-x-3.5 gap-y-2.5">
      {/* TODO: develop later*/}
      {/*<button className="h-10.5 bg-primary-100 text-grey-0 rounded pl-2 flex justify-center items-center gap-2" disabled>*/}
      {/*  <ViberIcon />*/}
      {/*  {t('Viber')}*/}
      {/*</button>*/}
      <button className="h-10.5 w-full bg-primary-100 text-grey-0 rounded overflow-hidden">
        <div className="relative flex justify-center" ref={telegramRef}>
          <div className="absolute top-0 left-0 pointer-events-none bg-primary-100 w-full h-full flex items-center justify-center gap-2">
            <TelegramIcon fill="#ffffff" width="25" height="25" />
            {t('Telegram')}
          </div>
        </div>
      </button>
      <div className="grid grid-cols-2 grid-rows-1 gap-x-3.5 gap-y-2.5 mt-3">
        <button
          onClick={onFacebookSignIn}
          className="h-10.5 bg-primary-100 text-grey-0 rounded pl-2 flex justify-center items-center gap-2"
        >
          <FacebookIconRounded />
          {t('Facebook')}
        </button>
        <button
          onClick={onGoogleSignIn}
          className="h-10.5 bg-primary-100 text-grey-0 rounded pl-2 flex justify-center items-center gap-2"
        >
          <GoogleIconRounded />
          {t('Google')}
        </button>
      </div>
    </div>
  );
};
