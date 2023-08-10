// @ts-nocheck
import { Adapter } from "next-auth/adapters";
import User from "../models/User";
import { models } from "./db";

const SequelizeAdapter: Adapter = {
  async getAdapter(appOptions) {
    console.log("appOptions", appOptions);
    return {
      async createUser({ email, name, password }) {
        const newUser = await models.User.create({ email, name, password });
        return newUser.toJSON();
      },

      async getUserByEmail(email) {
        const user = await models.User.findOne({ where: { email } });
        return user ? user.toJSON() : null;
      },

      async getUserById(id) {
        const user = await models.User.findByPk(id);
        return user ? user.toJSON() : null;
      },

      async updateUser(user) {
        await models.User.update(user, { where: { id: user.id } });
        const updatedUser = await models.User.findByPk(user.id);
        return updatedUser.toJSON();
      },

      async deleteUser(id) {
        const user = await models.User.findByPk(id);
        if (user) {
          await user.destroy();
          return user.toJSON();
        }
        return null;
      },
    };
  },
};

export default SequelizeAdapter;
