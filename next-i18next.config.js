module.exports = {
  i18n: {
    defaultLocale: "ru",
    locales: ["en", "ru"],
    localeDetection: true,
  },
  fallbackLng: {
    default: ['ru'],
    'uk': ['ru'],
  },
  nonExplicitSupportedLngs: true,
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
