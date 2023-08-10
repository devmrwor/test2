import { useTranslation } from 'next-i18next';
import { Roles } from '@enums';
import { SegmentedControl } from '@mantine/core';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

export default function Header({ userType, setUserType }) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 items-center">
      <SegmentedControl
        className="w-full"
        fullWidth
        value={userType}
        onChange={(value) => setUserType(value as Roles)}
        data={[
          { label: `${t('am_customer')}`, value: Roles.CUSTOMER },
          { label: `${t('am_executor')}`, value: Roles.EXECUTOR },
        ]}
      />
      <FontAwesomeIcon icon={faBell} size="xl" className="text-text-secondary" />
    </div>
  );
}
