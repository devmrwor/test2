import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { TextField } from '@mui/material';
import { ApiRoutes, ApiAuthRoutes, ClientRoutes, AuthRoutes } from '../../../common/enums/api-routes';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { CircleCheckBig } from '@/components/Icons/Icons';

const ResetEmailPasswordPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { t, i18n } = useTranslation();
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { token } = router.query;

  const onSubmit = async (data) => {
    if (!data.password) {
      setError(t('passwords_cant_be_empty'));
      return;
    }
    if (String(data.password).trim().length < 3) {
      setError(t('passwords_is_too_short'));
      return;
    }
    if (data.password !== data.repeat_password) {
      setError(t('passwords_should_match'));
      return;
    }
    try {
      const response = await fetch(
        uniteApiRoutes([ApiRoutes.AUTH, ApiAuthRoutes.RESET_PASSWORD], {
          lang: i18n.language,
          verifyEmail: 'false',
        }),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...data, token }),
        }
      );

      if (response.ok) {
        console.log(await response.json());
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError(String(err));
      console.log(err);
    }
  };

  return (
    <>
      {success ? (
        <div className="flex flex-col items-center">
          <div className="mt-[40.3px] mb-[22.7px]">{<CircleCheckBig />}</div>
          <h2 className="text-xl font-bold">{t('password_changed')}</h2>
          <p className="text-text-secondary mt-4.5 mb-[91.8px]">{t('successful_password_change')}</p>
          <Link href={uniteRoutes([ClientRoutes.CLIENT, AuthRoutes.LOGIN])} className="w-full max-w-xs px-3">
            <button type="button" className="bg-primary-100 text-white font-bold px-6 py-2 w-full rounded">
              {t('enter')}
            </button>
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 pt-8 text-center">
          {/*<h1 className="text-text-tertiary text-xl font-bold mb-4">{t('reset_password')}</h1>*/}
          <p className="text-text-tertiary text-lg mb-4">{t('enter_new_email_password')}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="text-text-primary text-left block">{t('new_password')}</label>
            <TextField
              type="password"
              fullWidth
              {...register('password', { required: false })}
              placeholder={t('enter_password')}
              style={{ marginTop: 0 }}
              sx={{
                '.MuiInputBase-root': {
                  height: '35px',
                },
              }}
            />
            <label className="text-text-primary text-left block">{t('repeat_new_password')}</label>
            <TextField
              type="password"
              fullWidth
              {...register('repeat_password', { required: false })}
              placeholder={t('enter_password_again')}
              style={{ marginTop: 0 }}
              sx={{
                '.MuiInputBase-root': {
                  height: '35px',
                },
              }}
            />
            {error && <p className="text-red-600">{t(error)}</p>}
            <button type="submit" className="bg-primary-100 text-white font-bold px-6 py-2 rounded">
              {t('done')}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default ResetEmailPasswordPage;
