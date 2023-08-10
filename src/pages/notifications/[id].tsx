import withLayout from '@/hocs/withLayout';
import { Roles } from '../../../common/enums/roles';
import withRole from '@/hocs/withRole';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';
import { useLayout } from '@/contexts/layoutContext';
import { uniteRoutes } from '@/utils/uniteRoute';
import { useTranslation } from 'next-i18next';
import { Routes } from '../../../common/enums/api-routes';
import { NotificationForm } from '@/components/NotificationForm';
import { NotificationRoutes } from '../../../common/enums/api-routes';
import { useRouter } from 'next/router';
import { createNotification, getNotificationById, getNotifications, updateNotification } from '@/services/notification';
import { INotification } from '../../../common/types/notification';
import { useMutation, useQuery } from 'react-query';
import { CreateButton } from '@/components/Buttons/ready/CreateButton';

const CreateNotificationPage = () => {
  const { setBreadcrumbs, addNotification } = useLayout();
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: uniteRoutes([Routes.USERS]), name: t('users') },
      { route: '', name: t('notifications') },
    ]);
  }, []);

  const { data: notification, isLoading: isLoadingNotification } = useQuery<INotification, Error>(
    ['notification', id],
    () => getNotificationById(id as string),
    {
      keepPreviousData: true,
    }
  );

  const { isLoading: isLoadingFormSubmit, mutateAsync } = useMutation<INotification, Error, INotification>(
    (values: INotification) => updateNotification(id as string, values)
  );

  const onSubmit = async (values: INotification) => {
    try {
      await mutateAsync(values);
      addNotification({
        type: 'success',
        text: t('updated_successfully'),
      });
      router.push(uniteRoutes([Routes.NOTIFICATIONS]));
    } catch {
      addNotification({
        type: 'error',
        text: t('error_on_notification_create'),
      });
    }
  };

  const isLoading = isLoadingFormSubmit || isLoadingNotification;

  return (
    <div className="flex flex-col">
      <CreateButton href={uniteRoutes([Routes.NOTIFICATIONS, NotificationRoutes.CREATE])}></CreateButton>
      <NotificationForm onSubmit={onSubmit} isLoading={isLoading} initialValues={notification} />
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

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default withRole(withLayout(CreateNotificationPage), [Roles.ADMIN]);
