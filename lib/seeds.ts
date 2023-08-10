import { queryInterface, models } from './db';
// @ts-ignore
import faker from 'faker';
import { metaTags } from '../common/constants/metaTags';
import { Tables } from '../common/enums/tables';
import { Roles } from '../common/enums/roles';
import { CustomerTypes } from '../common/enums/customer-type';
import { JobTypes } from '../common/enums/job-types';
import { radiuses } from '../common/constants/radiuses';
import { messengers } from '../common/constants/messengers';
import { languagesData } from '../common/constants/languages';
import { ProfileLanguages } from '../common/enums/profile-languages';
import { Bcrypt } from '@/utils/bcrypt';
import { ExportData } from '../common/enums/import-export-routes';
import { parseProfileBody } from '@/controllers/profile';
import { PaymentMethod } from '../common/enums/payment-method';
import { OrderStatuses } from '../common/enums/order-statuses';

const seedUsers = async (count = 15) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      role: faker.helpers.randomize(Object.values(Roles).filter((role) => role !== Roles.ADMIN)),
      name: faker.name.firstName(),
      photo: null,
      email: faker.internet.email(),
      password_hash: await Bcrypt.hash('test', 10),
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      login_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  await queryInterface.bulkInsert(Tables.USER, users);
};

const seedAdmins = async (count = 15) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      role: Roles.ADMIN,
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      patronymic: faker.name.lastName(),
      sort_order: i + 1,
      is_blocked: faker.random.boolean(),
      is_entry_allowed: true,
      authentication: true,
      username: faker.internet.userName().slice(-12),
      not_allowed_to_change_password: false,
      require_logging_password: false,
      photo: null,
      email: faker.internet.email(),
      password_hash: await Bcrypt.hash('test', 10),
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      login_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  users.push({
    role: Roles.ADMIN,
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    patronymic: faker.name.lastName(),
    username: faker.internet.userName(),
    sort_order: 0,
    is_entry_allowed: true,
    authentication: true,
    not_allowed_to_change_password: false,
    require_logging_password: false,
    photo: null,
    email: 'test@email.com',
    password_hash: await Bcrypt.hash('test@email.com', 10),
    phone: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(),
    login_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  });
  await queryInterface.bulkInsert(Tables.USER, users);
};

const seedCategories = async (count = 25) => {
  const categories = [];
  for (let i = 0; i < count; i++) {
    categories.push({
      name: faker.commerce.department(),
      sort_order: i,
      active_icon: null,
      passive_icon: null,
      status: faker.random.boolean(),
      parent_id: null,
      meta_tags: JSON.stringify([faker.helpers.randomize(metaTags), faker.helpers.randomize(metaTags)]),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  await queryInterface.bulkInsert(Tables.CATEGORY, categories);
};

const seedCategoryTags = async (count = 15) => {
  const tags = [];
  const { rows: categories } = await models.Category.findAndCountAll({});
  for (let i = 0; i < categories.length; i++) {
    tags.push({
      category_id: categories[i].id,
      tags: JSON.stringify([faker.helpers.randomize(metaTags), faker.helpers.randomize(metaTags)]),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  await queryInterface.bulkInsert(Tables.CATEGORY_TAGS, tags);
};

const seedProfiles = async (count = 15) => {
  let profiles = [];
  for (let i = 0; i < count; i++) {
    profiles.push({
      is_main: false,
      user_id: faker.random.number({ min: 1, max: 15 }),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
      category_id: faker.random.number({ min: 1, max: 5 }),
      photo: null,
      type: faker.helpers.randomize([CustomerTypes.COMPANY, CustomerTypes.INDIVIDUAL]),
      gender: faker.helpers.randomize(['male', 'female']),
      company_name: faker.company.companyName(),
      phone_numbers: JSON.stringify(faker.phone.phoneNumber()),
      messengers: JSON.stringify([
        {
          nicknameOrNumber: faker.internet.userName(),
          messenger: messengers[faker.helpers.randomize([0, 1, 2, 3, 4])],
        },
      ]),
      email: faker.internet.email(),
      is_working_remotely: faker.random.boolean(),
      address: faker.address.streetAddress(),
      show_address_publicly: faker.random.boolean(),
      additional_address: faker.address.streetAddress(),
      show_additional_address_publicly: faker.random.boolean(),
      can_visit_client: faker.random.boolean(),
      service_radius: faker.helpers.randomize(radiuses),
      portfolio_photos: null,
      video_presentation: null,
      description: faker.lorem.paragraph(),
      tags: JSON.stringify([faker.helpers.randomize(metaTags), faker.helpers.randomize(metaTags)]),
      // services_pricelist: null,
      education: JSON.stringify('Lorem ipsum dolor'),
      employment: JSON.stringify('Lorem ipsum dolor'),
      languages: JSON.stringify([languagesData[faker.helpers.randomize([0, 1, 2])]]),
      payment_details: JSON.stringify('Lorem ipsum dolor'),
      job_type: faker.helpers.randomize(Object.values(JobTypes)),
      profile_language: faker.helpers.randomize(Object.values(ProfileLanguages)),
      services_pricelist: JSON.stringify([
        { service: faker.lorem.words(2), price: faker.random.number({ min: 10, max: 500 }) },
        { service: faker.lorem.words(2), price: faker.random.number({ min: 10, max: 500 }) },
      ]),

      // education: JSON.stringify([
      //   { institution: faker.company.companyName(), degree: faker.name.jobTitle() },
      // ]),
      // employment: JSON.stringify([
      //   { company: faker.company.companyName(), position: faker.name.jobTitle() },
      // ]),
      // languages: JSON.stringify([
      //   { language: faker.lorem.word(), proficiency: faker.random.number({ min: 1, max: 5 }) },
      // ]),
      // payment_details: JSON.stringify([{ method: "PayPal", email: faker.internet.email() }]),
      volunteering: faker.random.boolean(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  profiles = profiles.map((profile) => {
    return parseProfileBody(profile);
  });
  await queryInterface.bulkInsert(Tables.PROFILE, profiles);
};

const seedRatings = async (count = 15) => {
  const ratings = [];
  for (let i = 1; i < count; i++) {
    ratings.push({
      profile_id: i + 15,
      rating: faker.random.number({ min: 1, max: 5 }),
      is_top_category: faker.random.boolean(),
      secure_deal_available: faker.random.boolean(),
      services_insured: faker.random.boolean(),
      top_executor: faker.random.boolean(),
      premium_executor: faker.random.boolean(),
      provides_volunteer_assistance: faker.random.boolean(),
      order_completed_on_time: faker.random.boolean(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  await queryInterface.bulkInsert(Tables.PROFILE_RATING, ratings);
};

const seedMainProfiles = async (count = 15) => {
  const profiles = [];
  for (let i = 0; i < count; i++) {
    profiles.push({
      is_main: true,
      user_id: i + 1,
      photo: null,
      name: faker.name.firstName(),
      phone_numbers: JSON.stringify(faker.phone.phoneNumber()),
      email: faker.internet.email(),
      messengers: JSON.stringify([
        {
          nicknameOrNumber: faker.internet.userName(),
          messenger: messengers[faker.helpers.randomize([0, 1, 2, 3, 4])],
        },
      ]),
      address: faker.address.streetAddress(),
      type: faker.helpers.randomize([CustomerTypes.COMPANY, CustomerTypes.INDIVIDUAL]),
      show_to_executors: faker.random.boolean(),
      gender: faker.helpers.randomize(['male', 'female']),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  await queryInterface.bulkInsert(Tables.PROFILE, profiles);
};

const seedOrders = async (count = 30) => {
  const orders = [];
  for (let i = 0; i < count; i++) {
    orders.push({
      name: faker.lorem.words(2),
      address: faker.address.streetAddress(),
      customer_id: faker.random.number({ min: 1, max: 10 }),
      executor_id: faker.random.number({ min: 1, max: 10 }),
      profile_id: faker.random.number({ min: 1, max: 10 }),
      category_id: faker.random.number({ min: 1, max: 5 }),
      description: faker.lorem.sentence(),
      status: faker.helpers.randomize(Object.values(OrderStatuses)),
      payment_method: faker.helpers.randomize(Object.values(PaymentMethod)),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  await queryInterface.bulkInsert(Tables.ORDER, orders);
};

const seedFeedbacks = async (count = 20) => {
  const feedbacks = [];
  for (let i = 0; i < count; i++) {
    feedbacks.push({
      order_id: i + 1,
      user_id: faker.random.number({ min: 1, max: 10 }),
      profile_id: faker.random.number({ min: 1, max: 10 }),
      rating: faker.helpers.randomize([faker.random.number({ min: 1, max: 5 }), null]),
      comment: faker.lorem.sentence(),
      unproved: faker.random.boolean(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  await queryInterface.bulkInsert(Tables.FEEDBACK, feedbacks);
};

const seedExportData = async (count = 20) => {
  const exportData = [];
  for (let i = 0; i < count; i++) {
    exportData.push({
      link: 'https://findout-media-production-001.s3.eu-central-1.amazonaws.com/images/537030f1-f221-4a91-a7c1-1f21bfeae72f-profiles_export.xlsx',
      is_successful: true,
      count_of_rows: 15,
      file_name: 'profiles_export.xlsx',
      type: faker.helpers.randomize(Object.values(ExportData)),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  await queryInterface.bulkInsert(Tables.EXPORT_DATA, exportData);
};

// const seedNotifications = async (count = 20) => {
//   const notifications = [];
//   for (let i = 0; i < count; i++) {
//     notifications.push({
//       created_at: new Date(),
//       updated_at: new Date(),
//     });
//   }
//   await queryInterface.bulkInsert(Tables.NOTIFICATION, notifications);
// };

export const seedAll = async () => {
  await seedUsers();
  await seedAdmins();
  await seedMainProfiles();
  await seedCategories();
  await seedProfiles();
  // await seedRatings();
  await seedOrders();
  await seedFeedbacks();
  // await seedExportData();
  // await seedNotifications();
  await seedCategoryTags();
};
