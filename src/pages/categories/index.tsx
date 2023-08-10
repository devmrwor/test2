import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, TableBody, TableCell, Typography, Pagination, debounce, Tooltip, Stack } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from 'react-query';
import { ICategory } from '../../../common/types/category';
import { Roles } from '../../../common/enums/roles';
import { CategoryRoutes, Routes } from '../../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';
import withRole from '@/hocs/withRole';
import withLayout from '@/hocs/withLayout';
import { createCategory, deleteCategory, getCategories } from '@/services/categories';
import { CategoryFilter } from '../../../common/enums/category-filter';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../common/constants/categoriesPagination';
import { formatDate } from '@/utils/dateFormatter';
import { useLayout } from '@/contexts/layoutContext';
import { IPaginationResponse } from '../../../common/types/pagination-response';
import { TableItem } from '@/components/primitives/TableItem';
import { Toggle } from '@/components/primitives/Toggle/toggle';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { CustomCheckbox } from '@/components/Checkbox/Checkbox';
import { CategoriesIconLg, CheckMarkIcon, FoldersIcon, MinusIcon, PlusIcon } from '@/components/Icons/Icons';
import classNames from 'classnames';
import { CustomTableRow } from '@/components/primitives/TableRow/TableRow';
import { useTable } from '@/hooks/useTable';
import { CreateButton } from '@/components/Buttons/ready/CreateButton';
import { BurgerButton } from '@/components/Buttons/BurgerButton';
import { SearchInput } from '@/components/primitives/SearchInput/SearchInput';
import { useTableHead } from '@/hooks/useTableHead';
import { useTableHeadData } from '@/hooks/useTableHeadData';
import useCategoryTranslation from '@/hooks/useCategoryTranslation';
import { SortOrders } from '../../../common/enums/sort-order';
import { FilterButton } from '@/components/Buttons/ready/FilterButton';
import { IProfile } from '../../../common/types/profile';

const FOLDER_VIEW_LS_KEY = 'folderView';

const CategoryPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { query } = router;
  const folderViewDefault = query.folderView === 'true' || localStorage.getItem(FOLDER_VIEW_LS_KEY) === 'true' || false;

  const { setBreadcrumbs, addNotification } = useLayout();
  const [page, setPage] = useState(query.page ? parseInt(query.page as string) : DEFAULT_PAGE);
  const [searchText, setSearchText] = useState(query.searchText || '');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [folderView, setSetFolderView] = useState(folderViewDefault);
  const [isLoadingDialog, setIsLoadingDialog] = useState(false);
  const [openedCategories, setOpenedCategories] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(query.limit ? parseInt(query.limit as string) : DEFAULT_LIMIT);
  const [filter, setFilter] = useState<CategoryFilter>((query.filter as CategoryFilter) || CategoryFilter.ALL);
  const { getFieldValue } = useCategoryTranslation();

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: '', name: t('categories') },
    ]);
  }, []);

  const deleteCategoryHandler = async (id: number, showMessages = true) => {
    const categoryId = id || 0;
    try {
      setIsLoadingDialog(true);
      await deleteCategory(categoryId.toString());
      showMessages &&
        addNotification({
          text: t('category_deleted'),
          type: 'success',
        });
      refetch();
    } catch {
      showMessages &&
        addNotification({
          text: t('error_deleting_category'),
          type: 'error',
        });
    } finally {
      setIsLoadingDialog(false);
    }
  };

  const deleteAllCategoriesHandler = async () => {
    const categoriesIds = categories?.rows.map((category) => category.id);
    if (!categoriesIds) return;
    try {
      await Promise.all(categoriesIds.map((categoryId) => deleteCategoryHandler(categoryId, false)));
      addNotification({
        text: t('categories_deleted'),
        type: 'success',
      });
      refetch();
    } catch {
      addNotification({
        text: t('error_deleting_categories'),
        type: 'error',
      });
    }
  };

  // const copyAllCategoriesHandler = async () => {
  //   const categoriesIds = categories?.rows.map((category) => category.id);
  //   if (!categoriesIds) return;
  //   try {
  //     await Promise.all(categoriesIds.map((categoryId) => copyCategoryHandler(categoryId, false)));
  //     addNotification({
  //       text: "Categories copied",
  //       type: "success",
  //     });
  //     refetch();
  //   } catch {
  //     addNotification({
  //       text: "Error copying categories",
  //       type: "error",
  //     });
  //   }
  // };

  const copyCategoryHandler = async (id?: number, showMessages = true) => {
    const categoryId = id || 0;
    try {
      const categoryData: ICategory | undefined = categories?.rows.find((category) => category.id === categoryId);
      if (!categoryData) return;
      const { name, sort_order, meta_tags, status, active_icon, passive_icon, parent_id } = categoryData;
      await createCategory({
        name,
        sort_order,
        meta_tags,
        status,
        active_icon,
        passive_icon,
        parent_id,
      } as ICategory);
      showMessages &&
        addNotification({
          text: t('category_copied'),
          type: 'success',
        });
      refetch();
    } catch {
      showMessages &&
        addNotification({
          text: t('error_copying_category'),
          type: 'error',
        });
    } finally {
      setIsLoadingDialog(false);
    }
  };

  const { tableHeadData, sortField, sortOrder } = useTableHeadData({
    columns: [
      folderView ? '' : undefined,
      'id',
      'category_name',
      'users',
      'profiles',
      'tags',
      'icon',
      'status',
      'date',
    ],
    setPage,
  });

  const {
    data: categories,
    error,
    isLoading,
    refetch,
  } = useQuery<IPaginationResponse<ICategory>, Error>(
    ['categories', page, rowsPerPage, filter, searchText, folderView, sortOrder, sortField],
    () =>
      getCategories(page, rowsPerPage, filter, searchText as string, folderView, sortOrder as SortOrders, sortField),
    { keepPreviousData: true }
  );

  const { popper, isAllSelected, toggleSelectedRow, toggleIsAllSelected, getIsRowSelected, handleOpen } = useTable({
    getHref: (id) => uniteRoutes([Routes.CATEGORIES, id]),
    rows: categories?.rows || [],
    deleteSingle: deleteCategoryHandler,
    deleteMultiple: deleteAllCategoriesHandler,
    copySingle: copyCategoryHandler,
  });

  const TableHead = useTableHead({
    tableHeadData,
    isAllSelected,
    toggleIsAllSelected,
  });

  const handleFolderView = (folderView: boolean) => {
    setSetFolderView(folderView);
    localStorage.setItem(FOLDER_VIEW_LS_KEY, folderView.toString());
    router.push({
      pathname: router.pathname,
      query: { ...query, folderView: folderView },
    });
  };

  const handleChangePageRounded = (_: any, newPage: number) => {
    setPage(newPage);
    router.push({
      pathname: router.pathname,
      query: { ...query, limit: rowsPerPage, page: newPage },
    });
  };

  const handleFilterChange = (newFilter: CategoryFilter) => {
    setFilter(newFilter);
    setPage(DEFAULT_PAGE);
    router.push({
      pathname: router.pathname,
      query: { ...query, filter: newFilter, page: DEFAULT_PAGE },
    });
  };

  const handleSearchTextChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(target.value);
    debouncedSearchText(target.value);
  };

  const debouncedSearchText = useCallback(
    debounce((searchText) => {
      setPage(DEFAULT_PAGE);
      router.push({
        pathname: router.pathname,
        query: { ...query, searchText, page: DEFAULT_PAGE },
      });
    }, 500),
    []
  );

  const from = (page - 1) * rowsPerPage + 1;
  const to = page * rowsPerPage;
  const count = categories?.count || 0;

  const handleCategoryFolderClick = (categoryId: number) => {
    if (openedCategories.includes(categoryId)) {
      setOpenedCategories(openedCategories.filter((id) => id !== categoryId));
    } else {
      setOpenedCategories([...openedCategories, categoryId]);
    }
  };

  const getUsersCount = (profiles: IProfile[]) => {
    const usersArray = profiles.reduce(
      (acc, profile) => (acc.includes(profile.user_id) ? acc : [...acc, profile.user_id]),
      [] as number[]
    );
    return usersArray?.length || 0;
  };

  return (
    <>
      <div className="flex justify-between max-h-13.5">
        <div className="flex mb-4 items-center gap-6">
          <div className="w-fit">
            <div className={classNames('w-[312px]', folderView && 'pointer-events-none opacity-0')}>
              <ButtonGroup
                buttons={[
                  {
                    text: t('all'),
                    isActive: filter === CategoryFilter.ALL,
                    onClick: () => handleFilterChange(CategoryFilter.ALL),
                  },
                  {
                    text: t('categories'),
                    isActive: filter === CategoryFilter.CATEGORIES,
                    onClick: () => handleFilterChange(CategoryFilter.CATEGORIES),
                  },
                  {
                    text: t('subcategories'),
                    isActive: filter === CategoryFilter.SUBCATEGORIES,
                    onClick: () => handleFilterChange(CategoryFilter.SUBCATEGORIES),
                  },
                ]}
              />
            </div>
          </div>
          <SearchInput placeholder={t('search_by_name')} value={searchText} onChange={handleSearchTextChange} />

          <FilterButton />

          <CreateButton href={uniteRoutes([Routes.CATEGORIES, CategoryRoutes.CREATE])} />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <p className="self-center text-text-secondary">{t('showed', { from, to, count })}</p>
          <div className="flex items-center gap-2">
            <Tooltip title={t('folder_tree_view_tip')} arrow>
              <button type="button" onClick={() => handleFolderView(true)}>
                <FoldersIcon fill={!folderView ? '#b0b0b0' : '#33a1c9'} />
              </button>
            </Tooltip>
            <Tooltip title={t('folder_list_view_tip')} arrow>
              <button type="button" onClick={() => handleFolderView(false)}>
                <CategoriesIconLg fill={folderView ? '#b0b0b0' : '#33a1c9'} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="min-h-table-height">
        <Table size="small" className="w-full ">
          {TableHead}
          {error && <Typography color="error">{error.message}</Typography>}
          {isLoading && <Typography>{t('loading')}</Typography>}

          {categories?.rows && (
            <TableBody>
              {categories.rows.map((category) => (
                <>
                  <CustomTableRow isActive={getIsRowSelected(category.id)} key={category.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <CustomCheckbox
                          checked={getIsRowSelected(category.id)}
                          onChange={(e) => toggleSelectedRow(category.id, e)}
                        />
                        <BurgerButton onClick={(e) => handleOpen(e, category.id)} />
                      </div>
                    </TableCell>
                    {folderView && (
                      <TableCell>
                        {
                          <button
                            className="h-6 w-6 flex justify-center items-center cursor-pointer"
                            type="button"
                            onClick={() => handleCategoryFolderClick(category.id)}
                          >
                            {openedCategories.includes(category.id) ? <PlusIcon /> : <MinusIcon />}
                          </button>
                        }
                      </TableCell>
                    )}
                    <TableCell>
                      <TableItem>{category.sort_order}</TableItem>
                    </TableCell>
                    <TableCell
                      sx={{
                        width: '45%',
                      }}
                    >
                      <div
                        className={classNames(
                          'cursor-pointer text-primary-100 hover:text-primary-900 hover:underline decoration-2 active:text-primary-80',
                          !category.parent_id && 'font-bold'
                        )}
                        onClick={() => router.push(uniteRoutes([Routes.CATEGORIES, category.id]))}
                      >
                        {getFieldValue('name', category)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TableItem>{category?.users_count || 0}</TableItem>
                    </TableCell>
                    <TableCell>
                      <TableItem>{category?.profiles_count || 0}</TableItem>
                    </TableCell>
                    <TableCell>
                      <TableItem>{category.meta_tags.length}</TableItem>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {(category.active_icon || category.passive_icon) && <CheckMarkIcon />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Toggle value={category.status} disabled />
                    </TableCell>
                    <TableCell>{formatDate(category.created_at)}</TableCell>
                  </CustomTableRow>
                  {folderView &&
                    openedCategories.includes(category.id) &&
                    category.subcategories.map((subcategory) => (
                      <CustomTableRow key={subcategory.id} isActive={isAllSelected || selectedRow === subcategory.id}>
                        <TableCell>
                          <CustomCheckbox
                            checked={getIsRowSelected(subcategory.id)}
                            onChange={(event) => toggleSelectedRow(subcategory.id, event)}
                          />
                          <BurgerButton onClick={(e) => handleOpen(e, subcategory.id)} />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <TableItem>{subcategory.sort_order}</TableItem>
                        </TableCell>
                        <TableCell
                          sx={{
                            width: '45%',
                          }}
                        >
                          <div
                            className={classNames('cursor-pointer', !subcategory.parent_id && 'font-bold')}
                            onClick={() => router.push(uniteRoutes([Routes.CATEGORIES, subcategory.id]))}
                          >
                            {subcategory.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <TableItem>{getUsersCount(subcategory.profiles)}</TableItem>
                        </TableCell>
                        <TableCell>
                          <TableItem>{subcategory?.profiles?.length || 0}</TableItem>
                        </TableCell>
                        <TableCell>
                          <TableItem>{subcategory.meta_tags.length}</TableItem>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {(subcategory.active_icon || subcategory.passive_icon) && <CheckMarkIcon />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Toggle value={subcategory.status} disabled />
                        </TableCell>
                        <TableCell>{formatDate(subcategory.created_at)}</TableCell>
                      </CustomTableRow>
                    ))}
                </>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
      <div className="my-5">
        <Pagination
          size="large"
          showFirstButton
          showLastButton
          color="primary"
          page={page}
          onChange={handleChangePageRounded}
          count={(categories?.count && Math.ceil(categories.count / rowsPerPage)) || 0}
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

export default withRole(withLayout(CategoryPage), [Roles.ADMIN]);
