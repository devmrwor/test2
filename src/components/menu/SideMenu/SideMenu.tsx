import React, { useState } from 'react';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { Routes, UserRoutes } from '../../../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import ListItem from '../common/ListItem';
import {
  BellIcon,
  CategoriesIcon,
  DropdownIconXs,
  ImportExportIcon,
  MenuGrid,
  ProfileBlankIcon,
  ReportIcon,
  SettingsIcon,
  TagIcon,
  UserIcon,
} from '@/components/Icons/Icons';

export default function SideMenu({ removeSpace }: { removeSpace?: boolean }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [openNestedRoute, setOpenNestedRoute] = useState('users');

  const menuItems = [
    {
      label: t('categories'),
      icon: CategoriesIcon,
      link: uniteRoutes([Routes.CATEGORIES]),
    },
    {
      label: t('users'),
      listName: 'users',
      icon: UserIcon,
      nestedItems: [
        {
          label: t('executors'),
          icon: () => <span className="bg-red-100 w-2 h-2 rounded-full" />,
          link: uniteRoutes([Routes.USERS, UserRoutes.EXECUTORS]),
        },
        {
          label: t('customers'),
          icon: () => <span className="bg-primary-100 w-2 h-2 rounded-full" />,
          link: uniteRoutes([Routes.USERS, UserRoutes.CUSTOMERS]),
        },
        {
          label: t('partners'),
          icon: () => <span className="bg-green-100 w-2 h-2 rounded-full" />,
          link: uniteRoutes([Routes.USERS, UserRoutes.PARTNERS]),
        },
        {
          label: t('administrators'),
          icon: () => <span className="bg-yellow-100 w-2 h-2 rounded-full" />,
          link: uniteRoutes([Routes.USERS, UserRoutes.ADMINS]),
        },
      ],
    },
    {
      label: t('user_profiles'),
      icon: ProfileBlankIcon,
      link: uniteRoutes([Routes.PROFILES]),
    },
    {
      label: t('tags'),
      icon: TagIcon,
      link: uniteRoutes([Routes.TAGS]),
    },
    {
      label: t('import_export'),
      icon: ImportExportIcon,
      link: uniteRoutes([Routes.IMPORT_EXPORT]),
    },
    {
      label: t('reports'),
      icon: ReportIcon,
      link: uniteRoutes([Routes.REPORTS]),
    },
    {
      label: t('notifications'),
      icon: BellIcon,
      link: uniteRoutes([Routes.NOTIFICATIONS]),
    },
    {
      label: t('settings'),
      icon: SettingsIcon,
      link: uniteRoutes([Routes.SETTINGS]),
    },
  ];

  return (
    <div
      className={classNames(
        'w-full h-fit max-w-menu mb-4 border-secondary border-2 rounded-md pb-6',
        !removeSpace && 'mt-13.5'
      )}
    >
      <div className="flex justify-between items-center bg-secondary w-full pt-2.75 pb-2.25 px-4 mb-2">
        <div className="flex gap-1 items-center">
          <MenuGrid />
          <h2 className="text-text-secondary">{t('menu')}</h2>
        </div>
        <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)}>
          <ExpandMoreIcon className={classNames(isMenuOpen && 'rotate-180')} color="secondary" />
        </button>
      </div>
      {isMenuOpen && (
        <div className="whitespace-pre">
          {menuItems.map((item) =>
            item.nestedItems ? (
              <div key={item.label}>
                <div
                  onClick={() => setOpenNestedRoute((prev) => (prev === item.listName ? '' : item.listName))}
                  className={classNames(
                    'flex justify-between items-center w-full px-4 py-2 cursor-pointer text-text-secondary hover:text-primary-100 hover:fill-primary-100 hover:bg-background transition-all'
                  )}
                >
                  <div className="flex gap-2 items-center">
                    <item.icon fill="currentColor" />
                    <h2 className="text-inherit">{item.label}</h2>
                  </div>
                  <button type="button">
                    <DropdownIconXs
                      className={classNames(openNestedRoute === item.listName && 'rotate-180')}
                      color="secondary"
                    />
                  </button>
                </div>
                {openNestedRoute === item.listName && (
                  <div className="w-nested-menu mx-auto mb-1">
                    {item.nestedItems.map((nestedItem) => (
                      <ListItem
                        key={nestedItem.link}
                        Icon={nestedItem.icon}
                        link={nestedItem.link}
                        label={nestedItem.label}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <ListItem key={item.link} Icon={item.icon} link={item.link} label={`${item.label}`} />
            )
          )}
        </div>
      )}
    </div>
  );
}
