import sequelize from "@lib/db";

async function syncDb() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Tables synced successfully");
  } catch (error) {
    console.error("Failed to sync tables:", error);
  } finally {
    await sequelize.close();
  }
}

syncDb();

export default syncDb;
