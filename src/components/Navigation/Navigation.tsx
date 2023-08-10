import React, { useState } from 'react';
import { NavigationMenu } from '../../../common/enums/navigation-menu';
import { BottomNavigation, BottomNavigationAction, Stack } from '@mui/material';
import { SOLID_COLOR, SECONDARY_COLOR } from '../../../common/constants/navigation-color';
import { BottomSearchIcon, Comment, CirclePlus, Star, UserIconBottom } from '../Icons/Icons';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { ClientRoutes } from '../../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';
import { useRouter } from 'next/router';
import { useClientContext } from '@/contexts/clientContext';
import { Roles } from '../../../common/enums/roles';

type NavigationProps = {
  selectedRoute: string;
};

export const Navigation = ({ selectedRoute }: NavigationProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(selectedRoute);
  const route = useRouter();
  const { userType } = useClientContext();

  return (
    <Stack
      className="-mx-4.5 text-text-secondary"
      sx={{
        '& .MuiBottomNavigationAction-root': {
          minWidth: 'initial',
        },
      }}
    >
      <BottomNavigation
        className="text-2xl"
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          component={Link}
          href={userType === Roles.CUSTOMER ? '/' + ClientRoutes.CLIENT : '/' + ClientRoutes.ORDER}
          className="text-text-secondary"
          label={t('search')}
          value={NavigationMenu.SEARCH}
          icon={<BottomSearchIcon fill={value === NavigationMenu.SEARCH ? SOLID_COLOR : SECONDARY_COLOR} />}
        />
        <BottomNavigationAction
          component={Link}
          href={uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.CHATS])}
          className="text-text-secondary"
          label={t('chats')}
          value={NavigationMenu.CHAT}
          icon={<Comment fill={value === NavigationMenu.CHAT ? SOLID_COLOR : SECONDARY_COLOR} />}
        />
        <BottomNavigationAction
          component={Link}
          href={uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.ORDERS])}
          className="text-text-secondary"
          label={t('orders')}
          value={NavigationMenu.ORDERS}
          icon={<CirclePlus fill={value === NavigationMenu.ORDERS ? SOLID_COLOR : SECONDARY_COLOR} />}
        />
        <BottomNavigationAction
          component={Link}
          href={uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.REVIEWS])}
          className="text-text-secondary"
          label={t('reviews')}
          value={NavigationMenu.REVIEWS}
          icon={<Star fill={value === NavigationMenu.REVIEWS ? SOLID_COLOR : SECONDARY_COLOR} />}
        />
        <BottomNavigationAction
          component={Link}
          href={uniteRoutes([ClientRoutes.CLIENT, userType])}
          // onClick={() => isAuthorized()}
          className="text-text-secondary"
          label={t('user_profile')}
          value={NavigationMenu.PROFILE}
          icon={<UserIconBottom fill={value === NavigationMenu.PROFILE ? SOLID_COLOR : SECONDARY_COLOR} />}
        />
      </BottomNavigation>
    </Stack>
  );
};
