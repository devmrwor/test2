const path = require('path');
const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_ENV_TARGET: process.env.NEXT_PUBLIC_ENV_TARGET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    HOSTNAME: process.env.HOSTNAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    JWT_SECRET: process.env.JWT_SECRET,
    LOG_LEVEL: process.env.LOG_LEVEL,
    S3_UPLOAD_KEY: process.env.S3_UPLOAD_KEY,
    S3_UPLOAD_SECRET: process.env.S3_UPLOAD_SECRET,
    S3_UPLOAD_BUCKET: process.env.S3_UPLOAD_BUCKET,
    S3_UPLOAD_REGION: process.env.S3_UPLOAD_REGION,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    NEXT_PUBLIC_TELEGRAM_BOT_NAME: process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lib': path.join(__dirname, 'lib'),
      '@config': path.join(__dirname, 'config'),
    };

    return config;
  },
  images: {
    domains: ['findout-media-production-001.s3.eu-central-1.amazonaws.com', 't.me'],
    loader: 'default',
  },
  i18n,
  typescript: {
    // !! WARN !!
    // This will disable type checking during the build process.
    // It is not recommended to disable type checking in production.
    ignoreBuildErrors: true,
    // tsconfigPath: "./tsconfig.json",
  },
  // output: 'standalone',
};

module.exports = nextConfig;
