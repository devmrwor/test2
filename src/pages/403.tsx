import { uniteRoutes } from '@/utils/uniteRoute';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthRoutes, Routes } from '../../common/enums/api-routes';

const ForbiddenPage = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: uniteRoutes([Routes.AUTH, AuthRoutes.LOGIN]), redirect: true });
  };

  useEffect(() => {
    router.prefetch(uniteRoutes([Routes.AUTH, AuthRoutes.LOGIN]));
  }, [router]);

  return (
    <div className="container mx-auto px-4 pt-8 text-center">
      <h1 className="text-text-primary text-4xl font-bold mb-4">403 - Forbidden</h1>
      <p className="text-text-primary text-xl mb-4">You do not have permission to access this resource.</p>
      <button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded">
        Sign Out
      </button>
    </div>
  );
};

export default ForbiddenPage;
