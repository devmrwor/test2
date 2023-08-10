import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, TableBody, TableCell, Typography, Pagination, debounce } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from 'react-query';
import { ICategory } from '../../../common/types/category';
import { Roles } from '../../../common/enums/roles';
import { Routes } from '../../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';
import withRole from '@/hocs/withRole';
import withLayout from '@/hocs/withLayout';
import { createCategory, getCategories } from '@/services/categories';
import { CategoryFilter } from '../../../common/enums/category-filter';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../common/constants/categoriesPagination';
import { useLayout } from '@/contexts/layoutContext';
import { IPaginationResponse } from '../../../common/types/pagination-response';
import { TableItem } from '@/components/primitives/TableItem';
import { CustomCheckbox } from '@/components/Checkbox/Checkbox';
import { MinusIcon, PlusIcon } from '@/components/Icons/Icons';
import classNames from 'classnames';
import { CustomTableRow } from '@/components/primitives/TableRow/TableRow';
import { useTable } from '@/hooks/useTable';
import { TagsModal } from '@/components/modals/TagsModal';
import { getTags, removeTags } from '@/services/tags';
import { SearchInput } from '@/components/primitives/SearchInput/SearchInput';
import { BurgerButton } from '@/components/Buttons/BurgerButton';
import { useTableHeadData } from '@/hooks/useTableHeadData';
import { useTableHead } from '@/hooks/useTableHead';
import { SortOrders } from '../../../common/enums/sort-order';
import { FilterButton } from '@/components/Buttons/ready/FilterButton';
import { CreateButton } from '@/components/Buttons/ready/CreateButton';

const CategoryPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { query } = router;
  const { setBreadcrumbs, addNotification } = useLayout();
  const [page, setPage] = useState(query.page ? parseInt(query.page as string) : DEFAULT_PAGE);
  const [searchText, setSearchText] = useState(query.searchText || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [folderView, setSetFolderView] = useState(query.folderView === 'true' || false);
  const [isLoadingDialog, setIsLoadingDialog] = useState(false);
  const [openedCategories, setOpenedCategories] = useState<number[]>([]);
  // const [isAllSelected, setIsAllSelected] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(query.limit ? parseInt(query.limit as string) : DEFAULT_LIMIT);
  const [filter, setFilter] = useState<CategoryFilter>((query.filter as CategoryFilter) || CategoryFilter.ALL);
  const [isOpenTagsModal, setIsOpenTagsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: '', name: t('tags') },
    ]);
  }, []);

  const deleteCategoryHandler = async (id: number, showMessages = true) => {
    const categoryId = id || selectedCategoryId;

    try {
      setIsLoadingDialog(true);
      await removeTags(categoryId);
      showMessages &&
        addNotification({
          text: 'Category tags deleted',
          type: 'success',
        });
      refetch();
    } catch {
      showMessages &&
        addNotification({
          text: 'Error deleting category tags',
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
        text: 'Categories tags deleted',
        type: 'success',
      });
      refetch();
    } catch {
      addNotification({
        text: 'Error deleting categories tags',
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
    const categoryId = id || selectedCategoryId;
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
          text: 'Category copied',
          type: 'success',
        });
      refetch();
    } catch {
      showMessages &&
        addNotification({
          text: 'Error copying category',
          type: 'error',
        });
    } finally {
      setIsLoadingDialog(false);
    }
  };

  const handleClick = (id: number) => {
    setIsOpenTagsModal(true);
    setSelectedCategory(categories?.rows.find((category) => category.id === id));
  };

  const { tableHeadData, sortField, sortOrder } = useTableHeadData({
    columns: ['id', 'category', 'tags_page'],
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

  const { data: tags, refetch: refetchTags } = useQuery('tags', () => getTags(0, 1000));

  const { popper, selectedRows, isAllSelected, toggleSelectedRow, toggleIsAllSelected, getIsRowSelected, handleOpen } =
    useTable({
      // getHref: (id) => {
      // 	uniteRoutes([Routes.CATEGORIES, id]);
      // 	console.log(id);
      // },
      handleClick: handleClick,
      rows: categories?.rows || [],
      deleteSingle: deleteCategoryHandler,
      deleteMultiple: deleteAllCategoriesHandler,
      copySingle: copyCategoryHandler,
    });

  const handleFolderView = (folderView: boolean) => {
    setSetFolderView(folderView);
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

  const TableHead = useTableHead({
    tableHeadData,
    isAllSelected,
    toggleIsAllSelected,
  });

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

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsOpenTagsModal(true);
  };

  const findTag = (category) => {
    const tag = tags && [...tags.rows].reverse().find((tag) => tag.category_id === category.id);
    return tag ? tag.tags : category.meta_tags;
  };

  const from = (page - 1) * rowsPerPage + 1;
  const to = page * rowsPerPage;
  const count = categories?.count || 0;

  useEffect(() => {
    if (categories) {
      setAllCategories(categories.rows);
    }
  }, [categories, tags, isOpenTagsModal]);

  const handleCategoryFolderClick = (categoryId: number) => {
    if (openedCategories.includes(categoryId)) {
      setOpenedCategories(openedCategories.filter((id) => id !== categoryId));
    } else {
      setOpenedCategories([...openedCategories, categoryId]);
    }
  };

  const getCategoriesTags = (tags) => {
    return typeof tags === 'string' ? tags.split(',').join(', ') : tags.join(', ');
  };

  const onCloseHandler = () => {
    setIsOpenTagsModal(false);
  };

  return (
    <>
      <div className="flex justify-between max-h-13.5">
        <div className="flex mb-4 items-center gap-6">
          <SearchInput
            placeholder={t('tags_filter_placeholder')}
            value={searchText}
            onChange={handleSearchTextChange}
          />

          <FilterButton />

          <CreateButton onClick={handleCreate}></CreateButton>
        </div>
      </div>

      <div className="min-h-table-height">
        <Table size="small" className="w-full ">
          {TableHead}

          {error && <Typography color="error">{error.message}</Typography>}
          {isLoading && <Typography>{t('loading')}</Typography>}

          {allCategories && (
            <TableBody>
              {allCategories.map((category) => (
                <>
                  <CustomTableRow isActive={getIsRowSelected(category.id)} key={category.id}>
                    <TableCell
                      sx={{
                        borderRight: '1px solid #E0E0E0',
                      }}
                    >
                      <div className="flex items-center">
                        <CustomCheckbox
                          checked={getIsRowSelected(category.id)}
                          onChange={(e) => toggleSelectedRow(category.id, e)}
                        />
                        <BurgerButton onClick={(e) => handleOpen(e, category.id)} />
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: '1px solid #E0E0E0',
                      }}
                    >
                      {!folderView ? (
                        category.sort_order
                      ) : (
                        <button
                          className="h-6 w-6 flex justify-center items-center cursor-pointer"
                          type="button"
                          onClick={() => handleCategoryFolderClick(category.id)}
                        >
                          {openedCategories.includes(category.id) ? <PlusIcon /> : <MinusIcon />}
                        </button>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        width: '45%',
                        borderRight: '1px solid #E0E0E0',
                      }}
                    >
                      <div
                        className={classNames(
                          'cursor-pointer text-primary-100 hover:text-primary-900 hover:underline decoration-2',
                          !category.parent_id && 'font-bold'
                        )}
                        onClick={() => router.push(uniteRoutes([Routes.CATEGORIES, category.id]))}
                      >
                        {category.name}
                      </div>
                    </TableCell>

                    <TableCell
                      sx={{
                        width: '55%',
                      }}
                    >
                      <TableItem position="left">{getCategoriesTags(findTag(category))}</TableItem>
                    </TableCell>
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
                        </TableCell>
                        <TableCell></TableCell>
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
                          <TableItem>{subcategory.meta_tags}</TableItem>
                        </TableCell>
                      </CustomTableRow>
                    ))}
                </>
              ))}
            </TableBody>
          )}
        </Table>
        <TagsModal open={isOpenTagsModal} onClose={onCloseHandler} category={selectedCategory} />
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
