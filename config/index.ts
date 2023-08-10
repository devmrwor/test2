import dotenv from 'dotenv';
dotenv.config();

const common = {
  env: process.env.NODE_ENV || 'development',
  dialect: 'postgres',
  // dialect: "sqlite::memory:",
  jwtLifetime: 7 * 24 * 60 * 60, // 7 days
  uploadDir: 'public/uploads',
  ssl: {
    rejectUnauthorized: false,
  },
};

const config = {
  ...common,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '1111',
  DB_NAME: process.env.DB_NAME || 'db',
  DB_HOST: process.env.DB_HOST || 'localhost',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  LOG_LEVEL: process.env.LOG_LEVEL || 'error',
};

export default config;
