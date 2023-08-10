import withLayout from '@/hocs/withLayout';
import withRole from '@/hocs/withRole';
import { Roles } from '../../../common/enums/roles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button, Checkbox, Pagination, Table, TableBody, TableCell } from '@mui/material';
import { TableLabel } from '@/components/primitives/TableLabel';
import { useTranslation } from 'next-i18next';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../common/constants/categoriesPagination';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';

import { CategoryIconXl } from '@/components/Icons/Icons';
import { TableHead } from '@/components/primitives/TableHead/TableHead';
import { useLayout } from '@/contexts/layoutContext';
import { NotificationRoutes, Routes } from '../../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';
import { NotificationPopper } from '@/components/poppers/NotificationPopper';
import { CustomCheckbox } from '@/components/Checkbox/Checkbox';
import { syncDb } from '@lib/sync';
import { useQuery } from 'react-query';
import { createNotification, deleteNotification, getNotifications } from '@/services/notification';
import { IPaginationResponse } from '../../../common/types/pagination-response';
import { NotificationTypes } from '../../../common/enums/notification-types';
import { CustomTableRow } from '@/components/primitives/TableRow/TableRow';
import { useTable } from '@/hooks/useTable';
import { INotification } from '../../../common/types/notification';
import { formatDate } from '@/utils/dateFormatter';
import { BurgerButton } from '@/components/Buttons/BurgerButton';
import { useTableHead } from '@/hooks/useTableHead';
import { useTableHeadData } from '@/hooks/useTableHeadData';
import { CreateButton } from '@/components/Buttons/ready/CreateButton';

export const NotificationsPage = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const query = router.query;
  const { setBreadcrumbs, addNotification } = useLayout();
  const [page, setPage] = useState(query.page ? parseInt(query.page as string) : DEFAULT_PAGE);

  const [filter, setFilter] = useState<NotificationTypes>(
    (query.filter as NotificationTypes) || NotificationTypes.FOR_CUSTOMER
  );

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: uniteRoutes([Routes.USERS]), name: t('users') },
      { route: '', name: t('notifications') },
    ]);
  }, []);

  const copyHandler = async (notificationId: number) => {
    try {
      const notification = notifications?.rows.find((notification) => notification.id === notificationId);

      if (!notification) return;

      const filteredField = ['id', 'created_at', 'updated_at', 'deletedAt'];
      if (notification) {
        filteredField.forEach((field) => delete notification[field]);
      }
      await createNotification(notification);
      refetch();

      addNotification({
        type: 'success',
        text: t('copied_successfully'),
      });
    } catch (error) {
      addNotification({
        type: 'error',
        text: t('copy_error'),
      });
    }
  };

  const deleteHandler = async (notificationId: number, showMessages = true) => {
    try {
      await deleteNotification(notificationId);
      showMessages &&
        addNotification({
          type: 'success',
          text: t('deleted_successfully'),
        });
      showMessages && refetch();
    } catch (error) {
      showMessages &&
        addNotification({
          type: 'error',
          text: t('notification_delete_error'),
        });
    }
  };

  const deleteNotificationMultiple = async (notificationIds: number[]) => {
    await Promise.all(notificationIds.map((notificationId) => deleteHandler(notificationId, false)));
    addNotification({
      type: 'success',
      text: t('deleted_successfully'),
    });
    refetch();
  };

  const handleFilterChange = (newFilter: NotificationTypes) => {
    setFilter(newFilter);
    setPage(DEFAULT_PAGE);
    router.push({
      pathname: router.pathname,
      query: { ...query, filter: newFilter, page: DEFAULT_PAGE },
    });
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
    router.push({
      pathname: router.pathname,
      query: { ...query, limit: DEFAULT_LIMIT, page: newPage },
    });
  };

  const { tableHeadData, sortField, sortOrder } = useTableHeadData({
    columns: ['id', 'notification', 'page', 'geography', 'look', 'date'],
    setPage,
  });

  const {
    data: notifications,
    error,
    isLoading,
    refetch,
  } = useQuery<IPaginationResponse<INotification>, Error>(
    ['notifications', page, DEFAULT_LIMIT, filter, sortField, sortOrder],
    () => getNotifications(page, DEFAULT_LIMIT, filter as NotificationTypes, sortField, sortOrder),
    { keepPreviousData: true }
  );

  const { popper, selectedRows, isAllSelected, handleOpen, toggleSelectedRow, toggleIsAllSelected, getIsRowSelected } =
    useTable({
      getHref: (id) => uniteRoutes([Routes.NOTIFICATIONS, id]),
      rows: notifications?.rows || [],
      deleteSingle: deleteHandler,
      deleteMultiple: deleteNotificationMultiple,
      copySingle: copyHandler,
    });

  const TableHead = useTableHead({
    tableHeadData,
    isAllSelected,
    toggleIsAllSelected,
  });

  // const tableHeadCells = [
  //   <CustomCheckbox checked={!!isAllSelected} onChange={toggleIsAllSelected} />,
  //   ...tableHeadData.map((data) => <TableLabel key={data.label}>{data.label}</TableLabel>),
  // ];

  const from = (page - 1) * DEFAULT_LIMIT + 1;
  const to = page * DEFAULT_LIMIT;

  return (
    <div className="">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="w-[243px]">
            <ButtonGroup
              buttons={[
                {
                  text: t('for_executor'),
                  isActive: filter === NotificationTypes.FOR_EXECUTOR,
                  onClick: () => handleFilterChange(NotificationTypes.FOR_EXECUTOR),
                },
                {
                  text: t('for_customer'),
                  isActive: filter === NotificationTypes.FOR_CUSTOMER,
                  onClick: () => handleFilterChange(NotificationTypes.FOR_CUSTOMER),
                },
              ]}
            />
          </div>

          <CreateButton href={uniteRoutes([Routes.NOTIFICATIONS, NotificationRoutes.CREATE])} />
        </div>
        <p className="self-center text-text-secondary">
          {t('showed', { from, to, count: notifications?.rows.length || 0 })}
        </p>
        <CategoryIconXl />
      </div>

      <Table size="small" className="w-full">
        <>
          {TableHead}

          <TableBody>
            {notifications?.rows &&
              notifications.rows.map((notification) => (
                <CustomTableRow isActive={getIsRowSelected(notification.id as number)} key={notification.id}>
                  <TableCell>
                    <CustomCheckbox
                      checked={getIsRowSelected(notification.id as number)}
                      onChange={(event) => toggleSelectedRow(notification.id as number, event)}
                    />
                    <BurgerButton onClick={(e) => handleOpen(e, notification.id)} />
                  </TableCell>
                  <TableCell>{notification.sort_order}</TableCell>
                  <TableCell sx={{ width: '40%' }}>
                    <div
                      onClick={() => router.push(uniteRoutes([Routes.NOTIFICATIONS, notification.id as number]))}
                      className="cursor-pointer text-primary-100"
                    >
                      {notification?.name ?? t('not_specified')}
                    </div>
                  </TableCell>
                  <TableCell>{notification.displaying_page}</TableCell>
                  <TableCell>{notification?.geography ?? t('not_specified')}</TableCell>
                  <TableCell>{notification?.look ?? t('not_specified')}</TableCell>

                  <TableCell>{formatDate(notification.created_at || new Date())}</TableCell>
                </CustomTableRow>
              ))}
          </TableBody>
        </>
      </Table>

      <div className="my-5">
        <Pagination
          size="large"
          showFirstButton
          showLastButton
          color="primary"
          page={page}
          onChange={handleChangePage}
          count={(notifications?.count && Math.ceil(notifications.count / DEFAULT_LIMIT)) || 0}
          variant="outlined"
          shape="rounded"
        />
      </div>

      {popper}
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  // await syncDb();
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default withRole(withLayout(NotificationsPage), [Roles.ADMIN]);
