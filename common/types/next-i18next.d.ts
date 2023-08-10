declare module 'next-i18next' {
  import { i18n } from 'i18next';

  export function appWithTranslation<P>(
    Component: React.ComponentType<P>,
    config?: i18n.InitOptions
  ): React.ComponentType<P>;

  export function useTranslation(dictionaries?: string | string[]): {
    t: (key: string, params?: Record<string, string | number>) => string;
    i18n: i18n;
  };

  export function withTranslation(): <P>(Component: React.ComponentType<P>) => React.ComponentType<P>;

  export function serverSideTranslations(
    locale: string,
    namespaces?: string[]
  ): Promise<{
    _nextI18Next: {
      initialI18nStore: {
        [x: string]: {};
      };
      userConfig: {
        [x: string]:
          | string
          | string[]
          | {
              [x: string]: {};
            };
      };
    };
  }>;

  export const Trans: React.ComponentType<{
    i18nKey?: string;
    defaults?: string;
    components?: React.ReactNode[];
    tOptions?: {};
    count?: number;
    parent?: string | React.ComponentType;
    i18n?: i18n;
    t?: (key: string) => string;
    ns?: string | string[];
    values?: {};
  }>;
}
