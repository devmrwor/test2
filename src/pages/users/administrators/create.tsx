import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withRole from '@/hocs/withRole';
import withLayout from '@/hocs/withLayout';
import { useLayout } from '@/contexts/layoutContext';
import AdminForm from '@/components/AdminForm';
import withUsersLayout from '@/hocs/withUsersLayout';
import { useUsersContext } from '@/contexts/usersContext';
import { syncDb } from '@lib/sync';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { ApiRoutes, Routes, UserRoutes } from '../../../../common/enums/api-routes';
import { IUser } from '../../../../common/types/user';
import { Roles } from '../../../../common/enums/roles';
import { useEffect, useState } from 'react';

const UsersPage = () => {
  const { t } = useTranslation();
  const { addNotification } = useLayout();

  const router = useRouter();
  const query = router.query;
  const { setBreadcrumbs } = useLayout();

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: uniteRoutes([Routes.USERS]), name: t('users') },
      { route: uniteRoutes([Routes.USERS, UserRoutes.ADMINS]), name: t('administrators') },
      { route: '', name: t('create') },
    ]);
  }, []);

  const createAdmin = async (data: IUser) => {
    try {
      setIsFormSubmitting(true);

      const response = await fetch(uniteApiRoutes([ApiRoutes.USERS]), {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(t('creating_user_error'));
      }
      router.push(uniteRoutes([Routes.USERS, UserRoutes.ADMINS]));
      addNotification({
        type: 'success',
        text: t('user_created'),
      });
    } catch (error) {
      addNotification({
        type: 'error',
        text: t('creating_user_error'),
      });
      console.error('Error creating user:', error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <>
      <AdminForm isLoading={isFormSubmitting} onSubmit={createAdmin} />
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

export default withRole(withLayout(withUsersLayout(UsersPage, true)), [Roles.ADMIN]);
