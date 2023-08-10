import { useTranslation } from 'next-i18next';
import { useClientContext } from '@/contexts/clientContext';
import { EmptyDataComponent } from '../Reviews/Customer/EmptyDataComponent';
import { WarningIcon, AddCircleIconOutline } from '../Icons/Icons';
import { IProfile } from '../../../common/types/profile';
import { CircularProgress } from '../primitives/CircularProgress/CircularProgress';
import { getFilledProfileValue } from '@/utils/getProfilePercent';
import { BaseButton } from '../Buttons/BaseButton';
import { StarIcon } from '@mantine/core';
import Link from 'next/link';
import { uniteRoutes } from '@/utils/uniteRoute';
import { ClientRoutes } from '../../../common/enums/api-routes';
import { ServicesItem } from '../ServicesItem/ServicesItem';

interface ServicesTabProps {
  services: IProfile[];
}

export const ServicesTab = ({ services }: ServicesTabProps) => {
  const { t } = useTranslation();
  const { userData, setFillProfile } = useClientContext();

  const handleAddService = () => {
    setFillProfile((prev) => !prev);
  };

  return (
    <>
      {!services.length ? (
        <div className="flex flex-col items-center">
          <EmptyDataComponent icon={<WarningIcon />} heading="no_added_services" />
        </div>
      ) : (
        <div className="my-8.5">
          <div className="flex justify-between items-center">
            <h2 className="text-text-primary text-lg mb-3">{t('executor_services')}</h2>

            <BaseButton
              fill="link"
              size="small"
              type="link"
              color="primary"
              Icon={AddCircleIconOutline}
              text={t('Add')}
              onClick={handleAddService}
            ></BaseButton>
          </div>
          <div className="flex flex-col gap-3.5">
            {services.map((item) => (
              <ServicesItem item={item} />
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-center pb-20">
        <BaseButton
          fill="outline"
          size="md"
          type="outline"
          color="primary"
          Icon={AddCircleIconOutline}
          text={t('Add')}
          onClick={handleAddService}
        ></BaseButton>
      </div>
    </>
  );
};
