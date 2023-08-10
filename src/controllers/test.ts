import sequelize, { models } from '@lib/db';
import { Includeable, Model, Op, Order, Sequelize } from 'sequelize';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../common/constants/categoriesPagination';
import { CustomerTypes } from '../../common/enums/customer-type';
import { Roles } from '../../common/enums/roles';
import { IPaginationResponse } from '../../common/types/pagination-response';
import { ITest } from '../../common/types/test';
import { createUser, getUserById } from './user';
import { ProfileLanguages } from '../../common/enums/profile-languages';
import { IProfileTranslation } from '../../common/types/profile-translation';
import { MessengerItem } from '../../common/types/messenger';
import { IUser } from '../../common/types/user';
import { SortOrders } from '../../common/enums/sort-order';
import { CustomerControllerOptions } from '../../common/types/controller-options';
import { createProfileStatistic } from './profileStatistic';

export async function createTest(id: number, data: Partial<ITest>): Promise<Model<ITest>> {

  const test = await models.Test.create({ ...data });
  return test;
}

export async function getTest(id: number): Promise<Model<ITest>> {
  
    const test = await models.Test.findByPk(id);
    if (!test) {
      throw new Error('Profile not found.');
    }
    return test;
  }
  
export async function createMultipleProfiles(data: ITest[], isTranslation = false): Promise<Model<ITest[]>> {
  const profiles: Model<ITest>[] = [];

  for (const item of data) {
    const email = item?.user_email;
    const profile_email = item?.email;
    if (!email) {
      throw new Error(`Executor_email is required in executor ${item.table_user_id}`);
    }
    if (!profile_email) {
      throw new Error(`Email_agent is required in form ${item.form_id}`);
    }

    const user = await models.User.findOne({ where: { email } });

    if (isTranslation) {
      const user_id = user.get('id');
      if (!user_id) {
        throw new Error(`User with email ${email} not found in executor ${item.table_user_id}`);
      }
      const language = item.profile_language;

      if (!language) {
        throw new Error(`Language is required in executor ${item.table_user_id}`);
      }

      const profiles = await models.Profile.findAll({
        where: { user_id, email: profile_email },
      });

      profiles.forEach(async (profile) => {
        const profileId = profile.get('id');
        await updateOrCreateProfileTranslation(profileId, language, item);
        await createProfileStatistic(profileId);
        profiles.push(profile);
      });
      return profiles;
    }

    if (!user) {
      const newUser = await createDefaultUserFromProfile(item as IUser, email);
      if (!newUser) {
        throw new Error(`User with email ${email} not found in executor ${item.table_user_id}`);
      }
      item.user_id = newUser.get('id') as number;
    } else {
      item.user_id = user.get('id') as number;
    }

    const profileData = {
      ...item,
      is_main: false,
    };

    if (!item.user_id) {
      throw new Error(`User id is required in executor ${item.table_user_id}`);
    }

    const profile = await createProfile(item.user_id, profileData);

    profiles.push(profile);
  }

  return profiles;
}

export const updateProfileByUserId = async (userId: number, profileId: number, data: Partial<IProfile>) => {
  const profile = await models.Profile.findByPk(profileId);

  if (!profile) {
    throw new Error('Profile not found.');
  }

  if (profile.get('user_id') !== userId) {
    throw new Error('You have no access to this profile.');
  }

  const updatedProfile = await profile.update(data);
  return updatedProfile.get();
};

export async function updateProfileDocument(
  id: string,
  userId: number,
  role: Roles,
  data: Partial<ITest>
): Promise<Model<ITest>> {
  if (role !== Roles.ADMIN) {
    const userProfile = await getProfileByUserId(userId);
    if (+id !== userProfile.get('id')) {
      throw new Error('You have no access to this profile.');
    }
  }

  const profile = await getProfileById(+id);

  const updatedProfile = await profile.update(JSON.parse(data as string));
  return updatedProfile;
}

export async function deleteProfileById(id: string, userId: string): Promise<string> {
  // if (id !== userId) throw new Error("You have no access to this profile.");
  await models.Profile.destroy({ where: { id } });

  return 'Profile deleted successfully.';
}

export async function getAllProfiles(): Promise<IPaginationResponse<IProfile>> {

  let where: Record<string, any> = {};
  where['id'] = id;
  if (customerType === CustomerTypes.COMPANY) {
    where['company_name'] = { [Op.ne]: null };
  }
  if (customerType === CustomerTypes.INDIVIDUAL) {
    where['company_name'] = { [Op.is]: null };
  }
  if (searchText) {
    where['name'] = { [Op.iLike]: `%${searchText}%` };
  }

  let ratingFilter = {};
  let translationsFilter = {};

  if (Object.keys(filter).length) {
    const {
      gender,
      is_working_remotely,
      category_id,
      photo,
      languages,
      address,
      service_radius,
      type,
      can_visit_client,
      is_documents_confirmed,
      rating,
      secure_deal_available,
      profile_language,
      highest_price,
      lowest_price,
      user_id,
    } = filter;

    if (gender) {
      where['gender'] = gender;
    }

    if (is_working_remotely) {
      where['is_working_remotely'] = is_working_remotely;
    }

    if (photo === 'true') {
      where['photo'] = { [Op.ne]: null };
    }

    if (address) {
      where['address'] = { [Op.iLike]: `%${address}%` };
    }

    if (service_radius) {
      where['service_radius'] = service_radius;
    }

    if (type) {
      where['type'] = type;
    }

    if (can_visit_client) {
      where['can_visit_client'] = can_visit_client;
    }

    if (category_id) {
      where['category_id'] = category_id;
    }

    if (is_documents_confirmed) {
      where['is_documents_confirmed'] = is_documents_confirmed;
    }

    if (user_id) {
      where['user_id'] = user_id;
    }

    if (languages && (typeof languages === 'string' || Array.isArray(languages))) {
      const languagesArray = typeof languages === 'string' ? [languages] : languages;
      const languageConditions = languagesArray.map((lang) => ({
        languages_codes: { [Op.like]: `%/${lang}/%` },
      }));

      where = {
        ...where,
        [Op.and]: languageConditions,
      };
    }

    if (highest_price) {
      const highestPrice = +highest_price;
      where['highest_price'] = {
        [Op.lte]: highestPrice,
      };
    }
    if (lowest_price) {
      const lowestPrice = +lowest_price;
      where['lowest_price'] = {
        [Op.gte]: lowestPrice,
      };
    }

    if (rating) {
      ratingFilter = {
        ...ratingFilter,
        rating: { [Op.gt]: rating },
      };
    }

    if (secure_deal_available) {
      ratingFilter = {
        ...ratingFilter,
        secure_deal_available: secure_deal_available,
      };
    }

    if (profile_language && profile_language.length <= 3) {
      // where['profile_language'] = profile_language;

      where[Op.or] = [
        Sequelize.literal(`"Profile"."profile_language" = '${profile_language}' OR "Profile"."id" IN (
    SELECT "ProfileTranslation"."profile_id" FROM "ProfileTranslations" AS "ProfileTranslation" WHERE "ProfileTranslation"."language" = '${profile_language}'
  )`),
      ];
    }
  }
  // FIXME: after import it won't load profiles with is_main=true,
  // so we need to split main profile and translation to it
  where['is_main'] = false;

  const includeRatings: Includeable = {
    model: models.ProfileRating,
    as: 'profile_rating',
    required: false,
    where: ratingFilter,
  };

  const includeTranslations: Includeable = {
    model: models.ProfileTranslation,
    required: false,
    where: translationsFilter,
    as: 'profile_translations',
    foreignKey: 'profile_id',
  };

  const includeUser: Includeable = {
    model: models.User,
    required: false,
    as: 'user',
  };

  const { count, rows } = await models.Profile.findAndCountAll({
    where,
    ...(limit ? { limit } : {}),
    offset,
    order,
    distinct: true,
    include: [includeRatings, includeTranslations, includeUser],
  });

  const totalPhotosData = await models.Profile.findOne({
    attributes: [[Sequelize.literal('SUM(ARRAY_LENGTH(portfolio_photos, 1))'), 'total_photos']],
    where,
  });

  const totalTagsData = await models.Profile.findOne({
    attributes: [[Sequelize.literal('SUM(json_array_length(tags))'), 'total_tags']],
    where,
  });

  return {
    count,
    rows,
    total_photos: totalPhotosData ? totalPhotosData.get('total_photos') : 0,
    total_tags: totalTagsData ? totalTagsData.get('total_tags') : 0,
  } as any;
}

export const getPublicProfiles = async (
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
  customerType: CustomerTypes = CustomerTypes.ALL,
  searchText: string = '',
  sortField: string,
  sortOrder: SortOrders,
  filter: Record<string, any> = {}
) => {
  const profiles = await getAllProfiles(page, limit, customerType, searchText, sortField, sortOrder, filter);
  const filteredField: (keyof IProfile)[] = ['document_photo', 'selfie_with_document'];
  profiles.rows.map((profile) => {
    for (const key in profile.dataValues) {
      if (profile.dataValues.hasOwnProperty(key) && filteredField.includes(key)) {
        delete profile.dataValues[key];
      }
    }
  });
  return profiles;
};

export const getProfilesByUserId = async (
  page: number,
  limit: number,
  userId: string,
  language?: ProfileLanguages
): Promise<Model<IProfile>[]> => {
  const offset = Math.max(0, (page - 1) * limit);

  const where: Record<string, any> = {};

  where['is_main'] = false;
  where['user_id'] = userId;

  const includeTranslations: Includeable = {
    model: models.ProfileTranslation,
    as: 'translations',
    required: false,
  };

  const includeRatings: Includeable = {
    model: models.ProfileRating,
    as: 'profile_rating',
    required: false,
  };

  const profiles = await models.Profile.findAndCountAll({
    where,
    limit,
    offset,
    include: [includeTranslations, includeRatings],
  });

  if (language) {
    let profileRows = [];
    profiles.rows.forEach((profile) => {
      if (profile.get('profile_language') === language) {
        profileRows.push(profile);
        return;
      }
      if (profile.get('translations')) {
        profile.get('translations').forEach((translation: IProfileTranslation) => {
          if (translation.language === language) {
            profileRows.push(translation);
          }
        });
      }
    });

    profiles.count = profiles.count - (profiles.rows.length - profileRows.length);
    profiles.rows = profileRows;
  }

  return profiles;
};
