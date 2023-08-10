import withLayout from '@/hocs/withLayout';
import withRole from '@/hocs/withRole';
import Link from 'next/link';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StyleIcon from '@mui/icons-material/Style';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Roles } from '../../common/enums/roles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { uniteRoutes } from '@/utils/uniteRoute';
import { Routes } from '../../common/enums/api-routes';
import { useRouter } from 'next/router';

import {
  BellIconXl,
  CategoriesIcon,
  CategoriesIconXl,
  ImportExportIconXl,
  ReportIconXl,
  TagIconXl,
  UserIconXl,
} from '@/components/Icons/Icons';
import { useLayout } from '@/contexts/layoutContext';
import React, { useEffect } from 'react';
import { CookiesAgreement } from '@/components/CookiesAgreement';
import { Stack } from '@mui/material';

const Home = () => {
  const { t } = useTranslation();
  const buttons = [
    {
      href: uniteRoutes([Routes.CATEGORIES]),
      label: t('categories'),
      icon: <CategoriesIconXl />,
    },
    {
      href: uniteRoutes([Routes.REPORTS]),
      label: t('reports'),
      icon: <ReportIconXl />,
    },
    {
      href: uniteRoutes([Routes.USERS]),
      label: t('users'),
      icon: <UserIconXl />,
    },
    {
      href: uniteRoutes([Routes.TAGS]),
      label: t('tags'),
      icon: <TagIconXl />,
    },
    {
      href: uniteRoutes([Routes.IMPORT_EXPORT]),
      label: t('import_export'),
      icon: <ImportExportIconXl />,
    },
    {
      href: uniteRoutes([Routes.NOTIFICATIONS]),
      label: t('notifications'),
      icon: <BellIconXl />,
    },
  ];

  const { setBreadcrumbs } = useLayout();

  useEffect(() => {
    setBreadcrumbs([
      {
        route: uniteRoutes([Routes.ROOT]),
        name: t('home'),
      },
    ]);
  }, []);

  return (
    <div className="container max-w-home mx-auto px-4 pt-13.25 pb-20">
      <div className="grid grid-cols-2 gap-8">
        {buttons.map((button, index) => (
          <div key={index} className="flex justify-center items-center">
            <Link className="w-full" href={button.href}>
              <button className="bg-background rounded-lg flex flex-col items-center justify-center w-full h-36 hover:border hover:border-toggle-background hover:shadow-none active:bg-darken-background active:shadow-none active:border active:border-toggle-background focus:bg-background focus:shadow-[1px_2px_4px_2px_rgba(0,0,0,0.2)] focus:border-2 focus:border-primary-800">
                <h2 className="text-xl font-medium text-gray-500 mb-4">{button.label}</h2>
                <div className="mb-4">{button.icon}</div>
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientHome = () => {
  const router = useRouter();
  useEffect(() => {
    // FIXME:
    if (process.env.NEXT_PUBLIC_ENV_TARGET == 'web') {
      router.replace('/client');
    }
  }, []);
  return <></>;
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const Component =
  process.env.NEXT_PUBLIC_ENV_TARGET === 'web' ? ClientHome : withRole(withLayout(Home, true, false), [Roles.ADMIN]);

export default Component;
