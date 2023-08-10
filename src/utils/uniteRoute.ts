import { clientBaseUrl } from '../../common/constants/baseUrl';
import { getBaseUrl } from './getBaseUrl';

type QueryParams = Record<string, string | number | undefined>;

export const uniteApiRoutes = (routes: (string | number)[], query?: QueryParams, baseUrl = '') => {
  const rootUrl = baseUrl || getBaseUrl();
  const url = `${rootUrl}/${routes.join('/')}`;

  if (!query) {
    return url;
  }

  const queryString = Object.entries(query)
    .filter(([, value]) => value)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `${url}?${queryString}`;
};

export const uniteServerApiRoutes = (routes: (string | number)[], query: QueryParams) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3000';
  return uniteApiRoutes(routes, query, baseUrl);
};

export const uniteRoutes = (routes: (string | number | boolean)[], query?: QueryParams) => {
  const url = `${clientBaseUrl}/${routes.filter(Boolean).join('/')}`.replace(/\/{2,}/g, '/');

  if (!query) {
    return url;
  }

  const queryString = Object.entries(query)
    .filter(([, value]) => value)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `${url}?${queryString}`;
};
