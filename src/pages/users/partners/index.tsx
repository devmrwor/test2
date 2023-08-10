// @ts-nocheck
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, TableBody, TableCell, Typography, Pagination } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from 'react-query';
import withRole from '@/hocs/withRole';
import withLayout from '@/hocs/withLayout';
import { formatDate } from '@/utils/dateFormatter';
import { useLayout } from '@/contexts/layoutContext';
import { Roles } from '../../../../common/enums/roles';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { AdminRoutes, ApiRoutes, Routes, UserRoutes } from '../../../../common/enums/api-routes';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../../common/constants/categoriesPagination';
import Link from 'next/link';
import { IPaginationResponse } from '../../../../common/types/pagination-response';
import { BurgerButton } from '@/components/Buttons/BurgerButton';
import { getFullName } from '@/utils/getFullName';
import { IUser } from '../../../../common/types/user';
import { deleteUserById, getUsers } from '@/services/users';
import classNames from 'classnames';
import { CustomCheckbox } from '@/components/Checkbox/Checkbox';
import { v4 as uuidv4 } from 'uuid';
import { CustomTableRow } from '@/components/primitives/TableRow/TableRow';
import { useTable } from '@/hooks/useTable';
import { useTableHeadData } from '@/hooks/useTableHeadData';
import { useTableHead } from '@/hooks/useTableHead';
import { CreateButton } from '@/components/Buttons/ready/CreateButton';

const UsersPage = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const query = router.query;

  const [page, setPage] = useState(query.page ? parseInt(query.page as string) : DEFAULT_PAGE);
  const [isLoadingDialog, setIsLoadingDialog] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(query.limit ? parseInt(query.limit as string) : DEFAULT_LIMIT);

  const { tableHeadData, sortField, sortOrder } = useTableHeadData({
    columns: ['id', 'user_full_name', 'type', 'status', 'date'],
    setPage,
  });

  const useQueryCallback = () => getUsers(page, rowsPerPage, Roles.PARTNER, sortField, sortOrder);

  const {
    data: partners,
    error,
    isLoading,
    refetch,
  } = useQuery<IPaginationResponse<IUser>>(['partners', page, rowsPerPage, sortOrder, sortField], useQueryCallback);

  const deletePartnersHandler = async () => {
    try {
      setIsLoadingDialog(true);
      await Promise.all(selectedRows.map((id) => deleteUserById(id.toString())));
      addNotification({
        text: t('partners_deleted_successfully'),
        type: 'success',
      });
      refetch();
    } catch {
      addNotification({
        text: t('partners_deleted_error'),
        type: 'error',
      });
    } finally {
      setIsLoadingDialog(false);
    }
  };

  const copyPartnerHandler = async (partnerId: number) => {
    try {
      const partnerData: IUser | undefined = partners?.rows.find((user) => user.id === partnerId);
      if (!partnerData) return;
      partnerData.password = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD;
      partnerData.email = `${partnerData.email}-${uuidv4()}`;
      delete partnerData.id;
      const response = await fetch(uniteApiRoutes([ApiRoutes.USERS]), {
        method: 'POST',
        body: JSON.stringify(partnerData),
      });

      if (!response.ok) {
        throw new Error(t('creating_user_error'));
      }

      addNotification({
        text: t('partner_copied_successfully'),
        type: 'success',
      });
      refetch();
    } catch {
      addNotification({
        text: t('partner_copied_error'),
        type: 'error',
      });
    }
  };

  const { popper, selectedRows, isAllSelected, toggleSelectedRow, toggleIsAllSelected, handleOpen, getIsRowSelected } =
    useTable({
      rows: partners?.rows || [],
      deleteSingle: deletePartnersHandler,
      deleteMultiple: deletePartnersHandler,
      copySingle: copyPartnerHandler,
    });

  const TableHead = useTableHead({
    tableHeadData,
    isAllSelected,
    toggleIsAllSelected,
  });

  const { setBreadcrumbs, addNotification } = useLayout();

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: uniteRoutes([Routes.USERS]), name: t('users') },
      { route: '', name: t('Partners') },
    ]);
  }, []);

  const handleChangePageRounded = (_: any, newPage: number) => {
    setPage(newPage);
    router.push({
      pathname: router.pathname,
      query: { ...query, limit: rowsPerPage, page: newPage },
    });
  };

  const from = page * rowsPerPage - rowsPerPage + 1;
  const to = page * rowsPerPage;
  const count = partners?.count || 0;

  const getIsPartnerBlocked = (user: IUser) => user.is_blocked || user.is_blocked === null;

  return (
    <>
      <div className="flex justify-end">
        <div className="flex mb-4 items-center gap-8">
          <CreateButton href={'#'} />

          <p className="self-center text-text-secondary">{t('showed', { from, to, count })}</p>
        </div>
      </div>
      <div className="min-h-table-height">
        <Table size="small" className="w-full">
          <>
            {TableHead}

            {error && <Typography color="error">{error.message}</Typography>}
            {isLoading && <Typography>{t('loading')}</Typography>}

            {partners?.rows && (
              <TableBody>
                {partners.rows.map((user) => (
                  <CustomTableRow isActive={selectedRows.includes(user.id as number)} key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <CustomCheckbox
                          checked={getIsRowSelected(user.id)}
                          onChange={(e) => toggleSelectedRow(user.id, e)}
                        />
                        <BurgerButton onClick={(e) => handleOpen(e, user.id)} />
                      </div>
                    </TableCell>
                    <TableCell>{user.sort_order ?? t('not_provided')}</TableCell>
                    <TableCell sx={{ width: '45%' }}>
                      <div className="text-primary-100">{getFullName(user)}</div>
                    </TableCell>
                    <TableCell>
                      <p className={classNames(getIsPartnerBlocked(user) ? 'text-red-500' : 'text-green-500')}>
                        {user.role}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className={classNames(getIsPartnerBlocked(user) ? 'text-red-500' : 'text-green-500')}>
                        {t(user.is_blocked ? 'blk.' : 'act.')}
                      </p>
                    </TableCell>

                    <TableCell>{formatDate(user.created_at as Date)}</TableCell>
                  </CustomTableRow>
                ))}
              </TableBody>
            )}
          </>
        </Table>
      </div>
      <div className="my-5">
        <Pagination
          size="large"
          showFirstButton
          showLastButton
          page={page}
          onChange={handleChangePageRounded}
          count={(partners?.count && Math.ceil(partners.count / rowsPerPage)) || 0}
          variant="outlined"
          shape="rounded"
        />
      </div>
      {popper}
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

export default withRole(withLayout(UsersPage), [Roles.ADMIN]);
