import { getErrorMessage } from "@/utils/getErrorMessage";
import sequelize from "./db";
import { seedAll } from "./seeds";

export const syncDb = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synchronized");
    await seedAll();
    console.log("Database seeded");
  } catch (error) {
    console.log(getErrorMessage(error));
    console.error("Error synchronizing the database:", error);
  } finally {
    // await sequelize.close();
  }
};

export const sync = async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.log(getErrorMessage(error));
    console.error("Error synchronizing the database:", error);
  }
};
