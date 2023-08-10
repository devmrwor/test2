import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, TableBody, TableCell, Typography, Pagination, TableRow } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from 'react-query';
import withRole from '@/hocs/withRole';
import withLayout from '@/hocs/withLayout';
import { formatDate } from '@/utils/dateFormatter';
import { useLayout } from '@/contexts/layoutContext';
import { createProfile, deleteProfileById, deleteProfilesByIds, getProfiles } from '@/services/profiles';
import { Roles } from '../../../common/enums/roles';
import { uniteRoutes } from '@/utils/uniteRoute';
import { Routes, UserRoutes, UserSubRoutes } from '../../../common/enums/api-routes';
import { CustomerTypes } from '../../../common/enums/customer-type';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../common/constants/categoriesPagination';
import Link from 'next/link';
import { IPaginationResponse } from '../../../common/types/pagination-response';
import { IProfile } from '../../../common/types/profile';
import { Toggle } from '@/components/primitives/Toggle/toggle';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { BurgerButton } from '@/components/Buttons/BurgerButton';
import { TableHead } from '@/components/primitives/TableHead/TableHead';
import { CustomCheckbox } from '@/components/Checkbox/Checkbox';
import { CustomTableRow } from '@/components/primitives/TableRow/TableRow';
import { useTable } from '@/hooks/useTable';
import { SearchInput } from '@/components/primitives/SearchInput/SearchInput';
import { SortOrders } from '../../../common/enums/sort-order';
import { useTableHeadData } from '@/hooks/useTableHeadData';
import { useTableHead } from '@/hooks/useTableHead';
import { ExpandScreenIcon } from '@/components/Icons/Icons';
import { TableItem } from '@/components/primitives/TableItem';
import { CreateButton } from '@/components/Buttons/ready/CreateButton';

const ProfilesPage = () => {
  const { t, i18n } = useTranslation();

  const router = useRouter();
  const query = router.query;
  const userRole = UserRoutes.EXECUTORS;

  const { setBreadcrumbs, addNotification } = useLayout();

  const [page, setPage] = useState(query.page ? parseInt(query.page as string) : DEFAULT_PAGE);
  const [searchText, setSearchText] = useState<string>((query.searchText as string) || '');
  const [rowsPerPage, setRowsPerPage] = useState(query.limit ? parseInt(query.limit as string) : DEFAULT_LIMIT);
  const [customerType, setCustomerType] = useState<CustomerTypes>(
    (query.customerType as CustomerTypes) || CustomerTypes.ALL
  );

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: uniteRoutes([Routes.PROFILES]), name: t('user_profiles') },
    ]);
  }, [userRole]);

  const useQueryCallback = [UserRoutes.EXECUTORS, UserRoutes.CUSTOMERS].includes(userRole as UserRoutes)
    ? () =>
        getProfiles(
          page,
          rowsPerPage,
          userRole as UserRoutes,
          customerType,
          searchText,
          sortOrder as SortOrders,
          sortField,
          i18n.language
        )
    : async () => {
        return { rows: [], count: 0 };
      };

  const deleteProfileHandler = async (id: number) => {
    try {
      await deleteProfileById(id);
      addNotification({
        text: t('profile_deleted_successfully'),
        type: 'success',
      });
      refetch();
    } catch {
      addNotification({
        text: t('profile_deleted_error'),
        type: 'error',
      });
    }
  };

  const deleteMultipleHandler = async (ids: number[]) => {
    try {
      await deleteProfilesByIds(ids);
      addNotification({
        text: t('profile_deleted_successfully'),
        type: 'success',
      });
      refetch();
    } catch (error) {
      console.log(error);
      addNotification({
        text: t('profile_deleted_error'),
        type: 'error',
      });
    }
  };

  const copyProfileHandler = async (profileId: number) => {
    try {
      const profile = profiles?.rows.find((profile) => profile.id === profileId);
      if (!profile) {
        return;
      }
      const profileCopy = { ...profile, photo: '' };
      const filteredField = ['id', 'deletedAt', 'created_at', 'updated_at'];
      filteredField.forEach((field) => {
        delete profileCopy[field];
      });
      console.log(profileCopy);
      await createProfile(profileCopy);
      addNotification({
        text: t('profile_copied_successfully'),
        type: 'success',
      });
      refetch();
    } catch {
      console.log(error);
      addNotification({
        text: t('profile_copied_error'),
        type: 'error',
      });
    }
  };

  const { tableHeadData, sortField, sortOrder } = useTableHeadData({
    columns: ['id', 'surname', 'name', 'company', 'city', 'tags', 'photo', 'status', 'date'],
    setPage,
  });

  const {
    data: profiles,
    error,
    refetch,
    isLoading,
  } = useQuery<IPaginationResponse<IProfile>>(
    ['profiles', page, rowsPerPage, searchText, customerType, userRole, sortOrder, sortField, i18n.language],
    useQueryCallback
  );
  const doubleClickHandler = (userId: number, profileId: number) => router.push(getProfileHref(userId, profileId));

  const getProfileHref = (userId: number, profileId: number) => {
    return uniteRoutes([
      Routes.USERS,
      userRole as string,
      userId,
      userRole === UserRoutes.CUSTOMERS && UserSubRoutes.MAIN,
      userRole === UserRoutes.EXECUTORS && UserSubRoutes.PROFILES,
      userRole === UserRoutes.EXECUTORS && profileId,
    ]);
  };
  const getUserId = (profileId: number) => {
    return profiles?.rows.find((profile) => profile.id === profileId)?.user_id;
  };

  const { popper, selectedRows, isAllSelected, toggleSelectedRow, toggleIsAllSelected, getIsRowSelected, handleOpen } =
    useTable({
      getHref: (id) => getProfileHref(getUserId(id) as number, id),
      rows: profiles?.rows || [],
      deleteSingle: deleteProfileHandler,
      deleteMultiple: deleteMultipleHandler,
      copySingle: copyProfileHandler,
    });

  const TableHead = useTableHead({
    tableHeadData,
    isAllSelected,
    toggleIsAllSelected,
  });

  const handleChangePageRounded = (_: any, newPage: number) => {
    setPage(newPage);
    router.push({
      pathname: router.pathname,
      query: { ...query, limit: rowsPerPage, page: newPage },
    });
  };

  const handleCustomerType = (newFilter: CustomerTypes) => {
    setCustomerType(newFilter);
    setPage(DEFAULT_PAGE);
    router.push({
      pathname: router.pathname,
      query: { ...query, filter: newFilter, page: DEFAULT_PAGE },
    });
  };

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setPage(DEFAULT_PAGE);
    router.push({
      pathname: router.pathname,
      query: { ...query, searchText: event.target.value, page: DEFAULT_PAGE },
    });
  };

  const from = page * rowsPerPage - rowsPerPage + 1;
  const to = page * rowsPerPage;
  const count = profiles?.count || 0;

  return (
    <>
      <div className="flex justify-between">
        <div className="flex mb-4 items-center gap-4">
          <div className="w-[317px]">
            <ButtonGroup
              buttons={[
                {
                  text: t('all'),
                  isActive: customerType === CustomerTypes.ALL,
                  onClick: () => handleCustomerType(CustomerTypes.ALL),
                },
                {
                  text: t('individual'),
                  isActive: customerType === CustomerTypes.INDIVIDUAL,
                  onClick: () => handleCustomerType(CustomerTypes.INDIVIDUAL),
                },
                {
                  text: t('companies'),
                  isActive: customerType === CustomerTypes.COMPANY,
                  onClick: () => handleCustomerType(CustomerTypes.COMPANY),
                },
              ]}
            />
          </div>

          <SearchInput
            placeholder={t('user_filter_placeholder')}
            value={searchText}
            onChange={handleSearchTextChange}
          />

          <CreateButton href={uniteRoutes([Routes.USERS, UserRoutes.CREATE])} />
        </div>
        <div className="flex items-center gap-9">
          <p className="self-center text-text-secondary">{t('showed', { from, to, count })}</p>
          <ExpandScreenIcon />
        </div>
      </div>
      <div className="min-h-table-height">
        <Table size="small" className="w-full">
          <>
            {TableHead}
            {error && <Typography color="error">{error.message}</Typography>}
            {isLoading && <Typography>{t('loading')}</Typography>}

            {profiles?.rows && (
              <TableBody>
                {profiles.rows.map((profile) => (
                  <CustomTableRow isActive={getIsRowSelected(profile.id)} key={profile.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <CustomCheckbox
                          checked={getIsRowSelected(profile.id)}
                          onChange={(e) => toggleSelectedRow(profile.id, e)}
                        />
                        <BurgerButton onClick={(e) => handleOpen(e, profile.id)} />
                      </div>
                    </TableCell>
                    <TableCell>{profile.id}</TableCell>
                    <TableCell>
                      <div
                        className="cursor-pointer max-w-messengers overflow-clip overflow-ellipsis whitespace-nowrap"
                        onClick={() => doubleClickHandler(profile.user_id, profile.id)}
                      >
                        {profile.surname}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="cursor-pointer max-w-messengers overflow-clip overflow-ellipsis whitespace-nowrap"
                        onClick={() => doubleClickHandler(profile.user_id, profile.id)}
                      >
                        {profile.name}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-messengers overflow-clip overflow-ellipsis whitespace-nowrap">
                      {profile.company_name}
                    </TableCell>
                    <TableCell className="max-w-messengers overflow-clip overflow-ellipsis whitespace-nowrap">
                      {profile.address}
                    </TableCell>
                    <TableCell>{profile.tags?.length || 0}</TableCell>
                    <TableCell>{profile.portfolio_photos?.length || 0}</TableCell>
                    <TableCell>
                      <Toggle value={profile?.status === 'visible'} disabled></Toggle>
                    </TableCell>
                    <TableCell>{formatDate(profile.created_at as Date)}</TableCell>
                  </CustomTableRow>
                ))}
                <TableRow
                  sx={{
                    borderRadius: '2px',
                    backgroundColor: '#e2e2e2',
                  }}
                >
                  <TableCell colSpan={6}>
                    <TableItem position="center">{t('total')}</TableItem>
                  </TableCell>
                  <TableCell>{profiles.total_tags || 0}</TableCell>
                  <TableCell>{profiles.total_photos || 0}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
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
          count={(profiles?.count && Math.ceil(profiles.count / rowsPerPage)) || 0}
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

export default withRole(withLayout(ProfilesPage), [Roles.ADMIN]);
