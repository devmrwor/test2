import { SegmentedControl } from '@mantine/core';
import { useState } from 'react';
import { Heart, BurgerIcon } from '@/components/Icons/Icons';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { useClientContext } from '@/contexts/clientContext';
import { uniteRoutes } from '@/utils/uniteRoute';
import { ClientRoutes, Routes } from '../../../common/enums/api-routes';
import { Roles } from '../../../common/enums/roles';

export default function Header({ onClick }: { onClick: () => void }) {
  const path = usePathname();
  const router = useRouter();
  const { userType, setUserType } = useClientContext();
  const [value, setValue] = useState<string>(
    path === '/' + ClientRoutes.CLIENT ? ClientRoutes.CLIENT : ClientRoutes.ORDER
  );
  // const [value, setValue] = useState<string>(userType === Roles.CUSTOMER ? ClientRoutes.CLIENT : ClientRoutes.ORDER);
  const { t } = useTranslation();

  const handleValueChange = (value: string) => {
    setValue(value);
    if (value === ClientRoutes.CLIENT) {
      router.push(Routes.ROOT + ClientRoutes.CLIENT);
    } else {
      router.push(ClientRoutes.ORDER);
    }
  };

  return (
    <div className="flex space-x-elGapX">
      <button onClick={onClick} className="flex items-center text-[30px]">
        <BurgerIcon />
      </button>
      <SegmentedControl
        value={value}
        onChange={handleValueChange}
        data={[
          { label: t('searching_service'), value: ClientRoutes.CLIENT },
          { label: t('searching_order'), value: ClientRoutes.ORDER },
        ]}
        sx={{ width: '100%' }}
        styles={{
          label: {
            color: 'white',
            '&[data-active]': {
              color: '#33a1c9 !important',
              fontWeight: 400,
            },
          },
          root: { backgroundColor: '#33a1c9' },
        }}
      />

      <div className="flex items-center text-[30px]">
        <Heart fill="#949494" />
      </div>
    </div>
  );
}
