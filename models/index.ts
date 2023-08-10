import { Sequelize } from 'sequelize';
import User from './User';
import Category from './Category';
import Feedback from './Feedback';
import Profile from './Profile';
import ProfileStatistic from './ProfileStatistic';
import Order from './Order';
import OrderStatistic from './OrderStatistic';
import CategoryTranslation from './CategoryTranslation';
import ProfileTranslation from './ProfileTranslation';
import ProfileRating from './Rating';
import ExportData from './ExportData';
import Notification from './Notification';
import CategoryTags from './CategoryTags';
import UserStatistic from './UserStatistic';
import ChatMessage from './ChatMessage';
import Chat from './Chat';
import Test from './Test';

export default (sequelize: Sequelize) => {
  const userModel = User(sequelize);
  const userStatisticModel = UserStatistic(sequelize);
  const categoryModel = Category(sequelize);
  const feedbackModel = Feedback(sequelize);
  const exportDataModel = ExportData(sequelize);
  const profileModel = Profile(sequelize);
  const profileStatisticModel = ProfileStatistic(sequelize);
  const orderModel = Order(sequelize);
  const orderStatisticModel = OrderStatistic(sequelize);
  const categoryTranslationModel = CategoryTranslation(sequelize);
  const profileTranslationModel = ProfileTranslation(sequelize);
  const ratingModel = ProfileRating(sequelize);
  const notificationModel = Notification(sequelize);
  const categoryTags = CategoryTags(sequelize);
  const chatMessagesModel = ChatMessage(sequelize);
  const chatsModel = Chat(sequelize);
  const testModel = Test(sequelize);

  chatsModel.hasMany(chatMessagesModel, {
    as: 'messages',
    foreignKey: 'chat_id',
  });

  chatsModel.belongsTo(orderModel, {
    as: 'order',
    foreignKey: 'order_id',
  });

  chatsModel.belongsTo(userModel, {
    as: 'executor',
    foreignKey: 'executor_id',
  });

  chatsModel.belongsTo(userModel, {
    as: 'customer',
    foreignKey: 'customer_id',
  });

  profileModel.hasMany(profileTranslationModel, {
    as: 'translations',
    foreignKey: 'profile_id',
  });

  profileTranslationModel.belongsTo(profileModel, {
    foreignKey: 'profile_id',
  });

  profileModel.hasMany(profileTranslationModel, {
    foreignKey: 'profile_id',
    as: 'profile_translations',
  });

  userModel.hasMany(chatMessagesModel, { foreignKey: 'sender_id', as: 'messages' });

  userStatisticModel.belongsTo(userModel, { as: 'statistic', foreignKey: 'user_id' });
  userModel.hasOne(userStatisticModel, { as: 'statistic', foreignKey: 'user_id' });

  userModel.hasMany(feedbackModel, { foreignKey: 'user_id' });
  feedbackModel.belongsTo(userModel, { foreignKey: 'user_id' });

  userModel.hasMany(profileModel, { as: 'profiles', foreignKey: 'user_id' });
  profileModel.belongsTo(userModel, { as: 'user', foreignKey: 'user_id' });

  profileModel.belongsTo(categoryModel, { as: 'category', foreignKey: 'category_id' });
  categoryModel.hasMany(profileModel, { as: 'profiles', foreignKey: 'category_id' });

  profileStatisticModel.belongsTo(profileModel, { as: 'statistic', foreignKey: 'profile_id' });
  profileModel.hasOne(profileStatisticModel, { as: 'statistic', foreignKey: 'profile_id' });

  categoryModel.hasMany(categoryModel, { as: 'subcategories', foreignKey: 'parent_id' });

  orderModel.belongsTo(userModel, { as: 'executor', foreignKey: 'executor_id' });
  orderModel.belongsTo(userModel, { as: 'user', foreignKey: 'customer_id' });
  userModel.hasMany(orderModel, { as: 'orders', foreignKey: 'customer_id' });

  orderStatisticModel.belongsTo(orderModel, { as: 'statistic', foreignKey: 'order_id' });
  orderModel.hasOne(orderStatisticModel, { as: 'statistic', foreignKey: 'order_id' });

  profileModel.hasOne(ratingModel, { as: 'profile_rating', foreignKey: 'profile_id' });
  exportDataModel.belongsTo(categoryModel, { as: 'category', foreignKey: 'category_id' });

  categoryTags.belongsTo(categoryModel, { as: 'category', foreignKey: 'category_id' });

  categoryModel.hasMany(categoryTranslationModel, { as: 'translations', foreignKey: 'category_id' });
  categoryTranslationModel.belongsTo(categoryModel, { foreignKey: 'category_id' });

  sequelize.query(`
  CREATE OR REPLACE FUNCTION json_array_length(json_array JSONB)
  RETURNS INTEGER AS
  $$
  BEGIN
    RETURN json_array_length(json_array);
  END;
  $$
  LANGUAGE plpgsql;
`);

  async function syncAllModels() {
    for (const modelName in sequelize.models) {
      if (sequelize.models.hasOwnProperty(modelName)) {
        await sequelize.models[modelName].sync();
      }
    }
  }

  syncAllModels();

  return sequelize.models;
};
