import { useState } from 'react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IRegisterDto } from '../../../common/types/register-dto';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { ApiAuthRoutes, ApiRoutes, AuthRoutes, EmailRoutes, Routes } from '../../../common/enums/api-routes';
import publicRoute from '@/hocs/publicRoute';
import { Roles } from '../../../common/enums/roles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const RegisterPage = () => {
  const { i18n, t } = useTranslation();
  const { register, handleSubmit } = useForm<IRegisterDto>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit: SubmitHandler<IRegisterDto> = async (data) => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    const response = await fetch(
      uniteApiRoutes([ApiRoutes.AUTH, ApiAuthRoutes.REGISTER], {
        lang: i18n.language,
      }),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      console.log(await response.json());
      // await signIn("credentials", {
      //   email: data.email,
      //   password: data.password,
      //   redirect: false,
      // });
      // router.push("/");
      router.push(uniteRoutes([Routes.EMAIL, EmailRoutes.CHECK_EMAIL]));
    } else {
      const data = await response.json();
      setError(data.message);
    }
    setIsLoading(false);
  };

  const handleLoginClick = () => {
    router.push(uniteRoutes([Routes.AUTH, AuthRoutes.LOGIN]));
  };

  return (
    <div className="container mx-auto px-4 pt-8">
      <h1 className="text-text-primary text-4xl font-bold mb-4">{t('register')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-text-primary text-xl font-semibold mb-2">{t('email')}:</label>
          <input
            {...register('email', { required: true })}
            className="text-text-primary border-2 border-gray-300 px-4 py-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-text-primary text-xl font-semibold mb-2">{t('password')}:</label>
          <input
            type="password"
            {...register('password', { required: true })}
            className="text-text-primary border-2 border-gray-300 px-4 py-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-text-primary text-xl font-semibold mb-2">{t('role')}:</label>
          <select
            {...register('role', { required: true })}
            className="text-text-primary border-2 border-gray-300 px-4 py-2 rounded w-full"
          >
            {Object.values(Roles).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-text-primary text-xl font-semibold mb-2">{t('name')}:</label>
          <input
            {...register('name', { required: true })}
            className="text-text-primary border-2 border-gray-300 px-4 py-2 rounded w-full"
          />
        </div>
        <div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded disabled:opacity-50 mr-4"
          >
            {t('register')}
          </button>
          <button
            disabled={isLoading}
            onClick={handleLoginClick}
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded"
          >
            {t('go_to_login')}
          </button>
        </div>
      </form>
      {isLoading && <p className="text-gray-600 mt-4">{t('login')}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
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

export default publicRoute(RegisterPage);
