import { useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ILoginDto } from '../../../common/types/login-dto';
import { Routes } from '../../../common/enums/api-routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TextField, Button, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'next-i18next';
import publicRoute from '@/hocs/publicRoute';
import { Languages } from '../../../common/enums/languages';
import { ExpandMore } from '@mui/icons-material';

const LoginPage = () => {
  const { register, handleSubmit } = useForm<ILoginDto>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const selectRef = useRef<HTMLSelectElement>(null);
  const { t, i18n } = useTranslation();

  const changeLanguage = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  const onSubmit: SubmitHandler<ILoginDto> = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: Routes.ROOT,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }
      router.push(Routes.ROOT);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-form text-center mx-auto px-4 pt-16">
      <h1 className="text-text-primary text-4xl font-medium mb-8">{t('login_page')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          label={t('email')}
          {...register('email', { required: true })}
          className="text-text-primary border-2 border-gray-300 px-4 py-2 rounded w-full"
        />
        <TextField
          label={t('password')}
          type="password"
          {...register('password', { required: true })}
          className="text-text-primary border-2 border-gray-300 px-4 py-2 rounded w-full"
        />
        <Button size="large" className="w-full" disabled={isLoading} type="submit" variant="contained">
          {t(isLoading ? 'loading' : 'login')}
        </Button>
      </form>
      {error && <p className="text-red-600">{t(error)}</p>}
      <div className="mt-8 flex justify-between">
        <Button type="button" variant="text" size="small">
          {t('forgot_password')}
        </Button>
        <Select
          ref={selectRef}
          className="relative z-10"
          variant="standard"
          id="language"
          value={i18n.language}
          onChange={(e) => {
            console.log(e.target.value);
            changeLanguage(e.target.value as string);
          }}
          IconComponent={() => (
            <div className="absolute top-1 right-0 z-0 cursor-pointer pointer-events-none">
              <ExpandMore fontSize="medium" />
            </div>
          )}
        >
          <MenuItem value={Languages.EN}>En</MenuItem>
          <MenuItem value={Languages.RU}>Ru</MenuItem>
        </Select>
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default publicRoute(LoginPage);
