import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withRole from '@/hocs/withRole';
import withLayout from '@/hocs/withLayout';
import { useLayout } from '@/contexts/layoutContext';
import { Roles } from '../../../../../../common/enums/roles';
import AdminForm from '@/components/AdminForm';
import withUsersLayout from '@/hocs/withUsersLayout';
import { useUsersContext } from '@/contexts/usersContext';
import { syncDb } from '@lib/sync';
import { IUser } from '../../../../../../common/types/user';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { ApiRoutes, Routes, UserRoutes } from '../../../../../../common/enums/api-routes';
import { useEffect } from 'react';

const UsersPage = () => {
  const { t } = useTranslation();
  const { addNotification } = useLayout();

  const router = useRouter();
  const query = router.query;
  const { username, user, isUserLoading } = useUsersContext();

  const { setBreadcrumbs } = useLayout();

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: uniteRoutes([Routes.USERS]), name: t('users') },
      { route: uniteRoutes([Routes.USERS, UserRoutes.ADMINS]), name: t('administrators') },
      { route: '', name: username },
    ]);
  }, [username]);

  const updateAdmin = async (data: IUser) => {
    try {
      const response = await fetch(uniteApiRoutes([ApiRoutes.USERS, user.id as number]), {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(t('updating_user_error'));
      }
      router.push(uniteRoutes([Routes.USERS, UserRoutes.ADMINS]));
      addNotification({
        type: 'success',
        text: t('user_updated'),
      });
    } catch (error) {
      addNotification({
        type: 'error',
        text: t('updating_user_error'),
      });
    } finally {
      // setIsFormSubmitting(false);
    }
  };

  return (
    <>
      <AdminForm initialValues={user} isLoading={isUserLoading || isUserLoading} onSubmit={updateAdmin} />
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

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default withRole(withLayout(withUsersLayout(UsersPage, true)), [Roles.ADMIN]);
