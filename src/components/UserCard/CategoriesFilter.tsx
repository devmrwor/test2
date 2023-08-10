//@ts-nocheck
import { useTranslation } from 'next-i18next';
import { BackHeader } from '../primitives/BackHeader/BackHeader';
import { TextField, SvgIcon } from '@mui/material';
import { MagnifyingGlass, ChevronDownBig } from '../Icons/Icons';
import { useQuery } from 'react-query';
import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiRoutes } from '../../../common/enums/api-routes';
import { IPaginationResponse } from '../../../common/types/pagination-response';
import { CategoryFilter } from '../../../common/enums/category-filter';
import { SortOrders } from '../../../common/enums/sort-order';
import { ICategory } from '../../../common/types/category';
import { useEffect, useState, useDeferredValue, SetStateAction, useRef } from 'react';
import { IFilter } from '../../../common/types/filter';
import { BackHeaderViews } from '../primitives/BackHeader/BackHeaderViews';
import { defaultFilters } from '../../../common/constants/defaultFilters';

interface CategoriesFilterProps {
  onClick: () => void;
  filters: IFilter[];
  setFilters: React.Dispatch<SetStateAction<IFilter>>;
  form?: boolean;
}

export const CategoriesFilter = ({ onClick, filters, setFilters, form = false }: CategoriesFilterProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [listView, setListView] = useState(true);
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

  useEffect(() => {
    if (!filters) {
      setFilters({ ...defaultFilters, category: { name: '', category_id: null } });
    }
  }, []);

  async function getCategories(
    page: number,
    limit: number,
    filter: CategoryFilter,
    searchText: string = '',
    folderView: boolean = true,
    sortField: string,
    sortOrder?: SortOrders
  ): Promise<IPaginationResponse<ICategory>> {
    const url = new URL(uniteApiRoutes([ApiRoutes.CATEGORIES, ApiRoutes.PUBLIC]));

    const params: Record<string, string | undefined> = {
      page: page.toString(),
      limit: limit.toString(),
      filter,
      searchText,
      folderView: folderView.toString(),
      sortOrder,
      sortField,
    };

    Object.keys(params).forEach((key) => params[key] && url.searchParams.append(key, params[key]));

    const categoriesRes = await fetch(url.toString());

    if (!categoriesRes.ok) throw new Error('Error fetching data');

    const categoriesData = await categoriesRes.json();

    return categoriesData;
  }

  //FIXME: categories limit
  const { isLoading, isError, data, error } = useQuery(['categories', searchTerm], () =>
    getCategories(1, 100000, CategoryFilter.CATEGORIES, searchTerm, true)
  );

  const handleSelectCategory = (name: string, id: string) => {
    if (form) {
      setFilters(name, id);
      return;
    }
    setFilters({ ...filters, category: { name, category_id: id } });
    localStorage.setItem('filters', JSON.stringify({ ...filters, category: { name, category_id: id } }));
    onClick();
  };

  const handleShowMore = (id) => {
    console.log(showAllSubcategories[10]);
    setShowAllSubcategories((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };

  if (!data) return <></>;

  if (!filters) {
    return <></>;
  }

  return (
    <div className="overflow-y-hidden">
      <div className="pl-3.75 pt-3.25 pr-4.25 mb-4.25">
        <BackHeaderViews
          heading="categories"
          onClick={onClick}
          headingColor="text-primary"
          listView={listView}
          listViewFunc={() => setListView(true)}
          folderViewFunc={() => setListView(false)}
        />
      </div>
      <div className="pl-4.25 pr-2.5">
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SvgIcon component={MagnifyingGlass} viewBox="0 0 24 24" />,
          }}
          sx={{
            '.MuiOutlinedInput-root': {
              height: '35px',
              backgroundColor: 'rgba(243, 243, 243, 1)',
            },
            '.MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '.MuiInputBase-input': {
              marginLeft: '14px',
              height: '32px',
            },
          }}
        />
      </div>
      <div className={`pt-6 pl-5.5 ${!listView && 'grid grid-cols-3 gap-x-3 gap-y-2.5'}`}>
        {data.map((category) => {
          return listView ? (
            <div key={category.id} className="mb-[26.3px]">
              <div onClick={() => handleSelectCategory(category.name, category.id)} className="flex items-center mb-2">
                {category.active_icon && (
                  <div className="w-5.5 h-5.5 mr-3">
                    <img src={category.active_icon} alt="" />
                  </div>
                )}
                <div
                  className={`text-lg text-primary leading-5 ${
                    filters.category.name === category.name && filters.category.category_id === category.id
                      ? 'text-primary-100'
                      : 'text-text-secondary'
                  }`}
                >
                  {category.name}
                </div>
                <div className="ml-3 mt-0.5 text-sm text-text-secondary leading-5">{category.profiles_count}</div>
              </div>

              <div>
                {category.subcategories.map((subcategory, index) => {
                  if (!showAllSubcategories[subcategory.parent_id] && index > 3) {
                    return null;
                  }
                  return (
                    <div
                      onClick={() => handleSelectCategory(subcategory.name, subcategory.parent_id)}
                      key={subcategory.id}
                      className={`text-base ${
                        filters.category.name === subcategory.name &&
                        filters.category.category_id === subcategory.parent_id
                          ? 'text-primary-100'
                          : 'text-text-secondary'
                      }`}
                    >
                      {subcategory.name}
                    </div>
                  );
                })}
                {category.subcategories.length > 4 && !showAllSubcategories[category.id] && (
                  <div className="flex items-center mt-2" onClick={() => handleShowMore(category.id)}>
                    <div className="text-text-secondary">{t('show_more')}</div>
                    <div className="ml-1.5">
                      <ChevronDownBig />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleSelectCategory(category.name, category.id)}
              key={category.id}
              className="w-22.5 h-22.5 bg-background rounded flex flex-col justify-center items-center"
            >
              {category.active_icon && (
                <div className="h-7.5 w-8.25">
                  <img src={category.active_icon} alt="" />
                </div>
              )}
              <div
                className={`mt-0.75 text-[15px] ${
                  filters.category.name === category.name && filters.category.category_id === category.id
                    ? 'text-primary-100'
                    : 'text-text-secondary'
                } `}
              >
                {category.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
