import sequelize, { models } from '@lib/db';
import { Includeable, Model, Op, Order, OrderItem, Sequelize } from 'sequelize';
import { DEFAULT_FILTER, DEFAULT_LIMIT, DEFAULT_PAGE } from '../../common/constants/categoriesPagination';
import { CategoryFilter } from '../../common/enums/category-filter';
import { ICategory } from '../../common/types/category';
import { IPaginationResponse } from '../../common/types/pagination-response';
import { SortOrders } from '../../common/enums/sort-order';

export async function getCategories(
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  filter: CategoryFilter = DEFAULT_FILTER,
  searchText: string = '',
  folderView: boolean = false,
  sortField: string | undefined,
  sortOrder: string | undefined
): Promise<IPaginationResponse<ICategory>> {
  const offset = Math.max(0, (page - 1) * limit);
  const order: Order = [];

  const fields = {
    id: 'sort_order',
    category: 'name',
    category_name: 'name',
    profiles: 'profiles',
    users: 'users',
    tags: 'tags',
    icon: 'icon',
    status: 'status',
    date: 'created_at',
  };

  const field = fields[sortField] || 'sort_order';
  const dir = sortOrder === SortOrders.ASC ? SortOrders.ASC : SortOrders.DESC;

  if (field === 'tags') {
    order.push([sequelize.literal('json_array_length(meta_tags)'), dir]);
  } else if (field === 'icon') {
    order.push(['active_icon', dir]);
    order.push(['passive_icon', dir]);
  } else if (field === 'profiles') {
    order.push([sequelize.literal('profiles_count'), dir]);
  } else if (field === 'users') {
    order.push([sequelize.literal('users_count'), dir]);
  } else if (field && dir) order.push([field, dir]);

  if (field !== 'sort_order') {
    order.push(['sort_order', 'ASC']);
  }

  console.log(order);

  const where: Record<string, any> = {};

  if (!folderView && filter === CategoryFilter.SUBCATEGORIES) {
    where['parent_id'] = { [Op.ne]: null };
  }
  if (!folderView && filter === CategoryFilter.CATEGORIES) {
    where['parent_id'] = { [Op.is]: null };
  }
  if (searchText) {
    where['name'] = { [Op.iLike]: `%${searchText}%` };
  }

  if (folderView) {
    where['parent_id'] = { [Op.is]: null };
  }

  const includeProfiles: Includeable = {
    model: models.Profile,
    as: 'profiles',
    required: false,
  };

  const includeSubcategories: Includeable = {
    model: models.Category,
    as: 'subcategories',
    required: false,
    include: [
      {
        model: models.Category,
        as: 'subcategories',
        required: false,
      },
      {
        model: models.Profile,
        as: 'profiles',
        required: false,
        attributes: ['user_id'],
      },
    ],
  };

  const includeTranslations: Includeable = {
    model: models.CategoryTranslation,
    as: 'translations',
    required: false,
  };

  const categoriesData = await sequelize.transaction(async (t) => {
    const { rows } = await models.Category.findAndCountAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`(
          SELECT COUNT(*)
          FROM "Profiles"
          WHERE "Profiles"."category_id" = "Category"."id" AND "deletedAt" IS NULL
        )::INTEGER`),
            'profiles_count',
          ],
          [
            Sequelize.literal(`(
          SELECT COUNT(DISTINCT("Profiles"."user_id"))
          FROM "Profiles"
          WHERE "Profiles"."category_id" = "Category"."id" AND "deletedAt" IS NULL
        )::INTEGER`),
            'users_count',
          ],
        ],
      },
      limit,
      offset,
      where,
      order,
      include: [includeProfiles, includeTranslations, includeSubcategories],
      transaction: t,
    });

    const { count } = await models.Category.findAndCountAll({
      where,
      transaction: t,
    });

    return {
      count,
      rows,
    };
  });

  return categoriesData as any;
}

export async function getCategoryById(id: number) {
  const category = await models.Category.findOne({
    where: { id },
    include: [
      {
        model: models.CategoryTranslation,
        as: 'translations',
        required: false,
      },
    ],
  });
  return category;
}

export async function createCategory(data: ICategory) {
  if (!data.parent_id && data.parent_id !== 0) {
    delete data.parent_id;
  } else {
    const parent = await models.Category.findOne({ where: { id: data.parent_id } });
    if (!parent) {
      throw new Error('Parent category not found.');
    }
  }
  const translations = data.translations[0] || [];

  const latestRecord = await models.Category.findOne({
    order: [['id', 'DESC']],
  });
  const sort_order = +data.sort_order ? data.sort_order : (latestRecord?.id || 0) + 1;
  const newCategory = await models.Category.create({
    ...data,
    sort_order,
  } as any);
  await models.CategoryTranslation.create({
    ...translations,
    category_id: newCategory.id,
  });
  return newCategory;
}

export async function deleteCategory(id: string): Promise<string> {
  const category = await models.Category.findOne({ where: { id } });
  if (!category) {
    throw new Error('Category not found.');
  }

  await category.destroy();

  await models.CategoryTranslation.destroy({
    where: {
      category_id: category.id,
    },
  });

  return 'Category deleted';
}

export async function updateCategory(id: string, data: Partial<ICategory>): Promise<Model<ICategory>> {
  const category = await models.Category.findOne({ where: { id } });

  if (!category) {
    throw new Error('Category not found.');
  }

  if (!data.parent_id && data.parent_id !== 0) {
    // delete data.parent_id;
  } else {
    const parent = await models.Category.findOne({ where: { id: data.parent_id } });
    if (!parent) {
      throw new Error('Parent category not found.');
    }
    if (+id === data.parent_id) {
      throw new Error('Category cannot be parent of itself.');
    }
    if (parent.get('parent_id')) {
      throw new Error('Category cannot be subcategory of subcategory.');
    }
  }

  const translations = data.translations || [];
  delete data.translations;

  await Promise.all(
    translations.map((el) => {
      return models.CategoryTranslation.upsert({
        ...el,
        category_id: category.id,
      });
    })
  );

  await category.update(data);

  return getCategoryById(category.id);
}

export async function getCategoryTags(
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  searchText: string = '',
  sortField: string = '',
  sortOrder: 'asc' | 'desc'
): Promise<IPaginationResponse<ICategory>> {
  const offset = Math.max(0, (page - 1) * limit);
  const order: Order = [];

  const fields = {
    date: 'created_at',
  };
  // @ts-ignore
  const field = fields[sortField] || sortField || 'id';
  const dir = String(sortOrder).toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  if (field === 'meta_tags') {
    order.push([sequelize.literal('json_array_length(tags)'), dir]);
  } else if (field === 'icon') {
    order.push(['active_icon', dir]);
    order.push(['passive_icon', dir]);
  } else {
    order.push([field, dir]);
  }

  if (field !== 'id') {
    order.push(['id', 'ASC']);
  }

  const where: Record<string, any> = {};
  const include = [];

  if (searchText) {
    // Prepare your where clause for the main query and for including the Category model
    const whereCategoryTags = { tags: { [Op.contains]: [searchText] } };
    const whereCategory = { name: { [Op.like]: '%' + searchText + '%' } };
    Object.assign(where, whereCategoryTags);
    include.push({
      model: models.Category, // Including Category model
      where: whereCategory, // Where clause for included Category
    });
  }

  const categoriesTagsData = await models.CategoryTags.findAndCountAll({
    where,
    include,
    ...(limit ? { limit } : {}),
    ...(offset ? { offset } : {}),
    order,
  });

  return categoriesTagsData as any;
}

export async function getCategoryTagsById(id: string) {
  const user = await models.Category.findByPk(id);
  return user;
}

export async function createCategoryTags(data) {
  const record = await models.CategoryTags.create(data);
  return record;
}

export async function removeCategoryTags(id) {
  await models.CategoryTags.destroy({
    where: { id },
    force: true,
  });
}
