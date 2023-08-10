// @ts-nocheck
import { SegmentedControl } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Roles } from '../../../../common/enums/roles';
import { useState, useEffect } from 'react';
import { useClientContext } from '@/contexts/clientContext';

interface SegmentedControlsProps {
  link?: boolean;
}

export const SegmentedControls = ({ link = false }: SegmentedControlsProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userType, setUserType } = useClientContext();

  const handleSaveRole = (type: string) => {
    localStorage.setItem('userType', type);
    setUserType(type);
  };

  return (
    <SegmentedControl
      fullWidth
      value={userType}
      onChange={(value) => {
        handleSaveRole(value);
        if (link) {
          router.push(value);
        }
      }}
      data={[
        { label: `${t('am_customer')}`, value: Roles.CUSTOMER },
        { label: `${t('am_executor')}`, value: Roles.EXECUTOR },
      ]}
      styles={{
        label: {
          fontSize: '16px',
          '&[data-active]': {
            fontWeight: 400,
          },
        },
      }}
    />
  );
};
