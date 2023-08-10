import { useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IRegisterDto } from '../../../common/types/register-dto';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { ApiAuthRoutes, ApiRoutes, AuthRoutes, Routes } from '../../../common/enums/api-routes';
import publicRoute from '@/hocs/publicRoute';
import { Roles } from '../../../common/enums/roles';

const TelegramPage = () => {
  const router = useRouter();
  const isLoading = useRef(false);

  const { id, ...params } = router.query;

  const login = async () => {
    if (isLoading.current) return;

    isLoading.current = true;

    signIn('credentials', {
      type: 'telegram',
      id,
      ...params,
      redirect: false,
    });
    router.push('/');
  };

  useEffect(() => {
    if (id) login();
  }, [id]);

  return (
    <div className="container mx-auto px-4 pt-8">
      <p className="text-gray-600 mt-4">Loading...</p>
    </div>
  );
};

export default publicRoute(TelegramPage);
