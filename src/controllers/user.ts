import { models } from '@lib/db';
import { Includeable, Model, Order } from 'sequelize';
import { IUser } from '../../common/types/user';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../common/constants/categoriesPagination';
import { IProfile } from '../../common/types/profile';
import { Roles } from '../../common/enums/roles';
import { Bcrypt } from '@/utils/bcrypt';
import { SortOrders } from '../../common/enums/sort-order';
import { createUserStatistic } from './userStatistic';

export async function getAllUsers() {
  const users = await models.User.findAll();
  return users;
}

export async function getUsers(
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  filter: Roles,
  sortField: string = '',
  sortOrder: SortOrders
) {
  const offset = Math.max(0, (page - 1) * limit);
  const order: Order = [];

  const fields = {
    id: 'sort_order',
    date: 'created_at',
    role: 'role',
    status: 'is_blocked',
    user_full_name: 'surname',
  };
  // @ts-ignore
  const field = fields[sortField] || 'sort_order';
  const dir = sortOrder === SortOrders.ASC ? SortOrders.ASC : SortOrders.DESC;

  order.push([field, dir]);

  if (field !== 'sort_order') {
    order.push(['sort_order', 'ASC']);
  }

  const where = filter ? { role: filter } : {};
  const users = await models.User.findAndCountAll({
    where,
    limit,
    offset,
    order,
  });
  return users;
}

export async function getUserById(id: number) {
  const includeProfiles: Includeable = {
    model: models.Profile,
    as: 'profiles',
    required: false,
    include: [
      {
        model: models.Category,
        as: 'category',
        required: false,
        attributes: ['name'],
      },
      {
        model: models.ProfileRating,
        as: 'profile_rating',
        required: false,
      },
    ],
  };

  const includeStatistic: Includeable = {
    model: models.UserStatistic,
    as: 'statistic',
    required: false,
  };

  const user: Model<IUser> | null = await models.User.findByPk(id, {
    include: [includeProfiles, includeStatistic],
  });

  if (!user) {
    throw new Error('User not found.');
  }
  return user;
}

export async function toggleIsBlockedUserById(id: string) {
  const user = await getUserById(id);
  const updatedUser = await user.update({ is_blocked: !user.get('is_blocked') });
  return updatedUser;
}

export async function updateUserById(id: string, data: IUser) {
  const user = await getUserById(id);
  if (!user) {
    throw new Error('User not found.');
  }
  if (data.password) {
    data.password_hash = await Bcrypt.hash(data.password, 10);
  }

  if (data.messengers) {
    data.messengers = typeof data.messengers === 'string' ? JSON.parse(data.messengers) : data.messengers;
  }

  const updatedUser = await user.update(data);
  return updatedUser;
}

export async function createUser(data: IUser) {
  const existingUser = await models.User.findOne({ where: { email: data.email } });

  // FIXME: do not return user, throw error instead
  if (existingUser) {
    return existingUser;
    // throw new Error("User with this email already exists.");
  }

  if (!data.password) throw new Error('Password is required');

  data.password_hash = await Bcrypt.hash(data.password, 10);

  const newUser = await models.User.create(data);
  await createUserStatistic(newUser.id);
  return newUser;
}

export async function deleteUserById(id: string) {
  await models.User.destroy({ where: { id } });

  return 'User deleted successfully.';
}

export const getUserMessengers = async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT, id: string) => {
  try {
    const offset = Math.max(0, (page - 1) * limit);
    const user = await getUserById(id);

    const profiles = user.get('profiles');

    if (!profiles) return { rows: [], count: 0 };

    const messengers = profiles
      .map((profile: IProfile) =>
        (typeof profile.get('messengers') === 'string'
          ? JSON.parse(profile.get('messengers'))
          : profile.get('messengers')
        ).map((item) => ({ ...item, profileId: profile.get('id') }))
      )
      .flat();

    const paginatedMessengers = messengers.slice(offset, offset + limit);
    return { rows: paginatedMessengers, count: messengers.length };
  } catch (err) {
    console.log(err);
    return { rows: [], count: 0 };
  }
};
