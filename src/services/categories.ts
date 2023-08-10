import categories from '@/pages/categories';
import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiRoutes } from '../../common/enums/api-routes';
import { CategoryFilter } from '../../common/enums/category-filter';
import { ICategory } from '../../common/types/category';
import { IPaginationResponse } from '../../common/types/pagination-response';
import { SortOrders } from '../../common/enums/sort-order';

const getSortOrder = (sort?: SortOrders) => {
  if (!sort) return ['null', 'null'];
  return sort.split('-');
};

export async function getCategories(
  page: number,
  limit: number,
  filter: CategoryFilter,
  searchText: string = '',
  folderView: boolean = false,
  sortOrder?: SortOrders,
  sortField: string
): Promise<IPaginationResponse<ICategory>> {
  const url = new URL(uniteApiRoutes([ApiRoutes.CATEGORIES]));

  // const [sort, order] = getSortOrder(sortOrder);

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

export const getCategoriesParents = async (id?: string) => {
  const response: IPaginationResponse<ICategory> = await getCategories(0, 100, CategoryFilter.CATEGORIES);
  const categories = id ? response.rows.filter((category: ICategory) => category.id !== +id) : response.rows;
  return categories;
};

export const getCategory = async (id: string) => {
  const categoryRes = await fetch(uniteApiRoutes([ApiRoutes.CATEGORIES, id]));

  if (!categoryRes.ok) throw new Error('Error fetching data');

  const category = await categoryRes.json();

  return category;
};

export const deleteCategory = async (id: string) => {
  const categoryRes = await fetch(uniteApiRoutes([ApiRoutes.CATEGORIES, id]), {
    method: 'DELETE',
  });

  if (!categoryRes.ok) throw new Error('Error deleting category');

  const category = await categoryRes.json();

  return category;
};

export const createCategory = async (category: ICategory) => {
  const formData = new FormData();
  Object.keys(category).forEach((key) => formData.append(key, category[key]));

  const categoryRes = await fetch(uniteApiRoutes([ApiRoutes.CATEGORIES]), {
    method: 'POST',
    body: formData,
  });

  if (!categoryRes.ok) throw new Error('Error creating category');

  const categoryData = await categoryRes.json();

  return categoryData;
};

export const getAllCategories = async (filter = CategoryFilter.CATEGORIES, folderView = true): Promise<ICategory[]> => {
  const response: IPaginationResponse<ICategory> = await getCategories(0, 1000, filter, undefined, folderView);
  const rows = response.rows
    .map((el) => [el, ...(el.subcategories || [])])
    .flat()
    .filter(Boolean);

  return rows;
};

export const getAllCategoryIds = async (): Promise<number[]> => {
  const response: ICategory[] = await getAllCategories();
  return response.map((category: ICategory) => category.id);
};
