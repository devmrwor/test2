import { useUsersContext } from '@/contexts/usersContext';
import { useTranslation } from 'next-i18next';
import { Label } from '../primitives/Label/Label';
import { FormControlsWrapper } from '../FormControlsWrapper/FormControlsWrapper';
import { fillUserId } from '@/utils/formatUserId';
import { formatDate } from '@/utils/dateFormatter';

import { CalendarIcon, EnvelopeIcon, FeatherIcon, LocationIcon, PhoneIcon, StarIcon } from '../Icons/Icons';
import { IUser } from '../../../common/types/user';

export const CustomerBlock = () => {
  const { user } = useUsersContext();
  const { t } = useTranslation();

  const mainProfile: IUser | undefined = user;

  return (
    <div className="mt-5">
      {mainProfile ? (
        <div className="mt-5">
          <div className="flex flex-col gap-2 mb-7">
            <Label text={mainProfile.name} />
            <p className="text-text-secondary">{mainProfile.type}</p>
            <FormControlsWrapper>
              <p className="text-text-secondary">{t('profile_number')}</p>
              <p className="text-text-secondary">{fillUserId(mainProfile.id)}</p>
            </FormControlsWrapper>
          </div>

          <div className="flex flex-col gap-3 mb-7">
            <FormControlsWrapper classes="gap-2" type="left">
              <StarIcon />
              <p className="text-text-secondary">{'0 ' + t('ratings_left')}</p>
            </FormControlsWrapper>
            <FormControlsWrapper classes="gap-2" type="left">
              <FeatherIcon />
              <p className="text-text-secondary">{'0 ' + t('orders_placed')}</p>
            </FormControlsWrapper>
          </div>

          <div className="flex flex-col gap-3 mb-7">
            <FormControlsWrapper classes="gap-2" type="left">
              <EnvelopeIcon />
              <p className="text-primary-100">{mainProfile.email}</p>
            </FormControlsWrapper>
            <FormControlsWrapper classes="gap-2" type="left">
              <LocationIcon />
              <p className="text-primary-100">{mainProfile.address}</p>
            </FormControlsWrapper>
            <FormControlsWrapper classes="gap-2" type="left">
              <PhoneIcon />
              <p className="text-primary-100">{mainProfile.phone_numbers}</p>
            </FormControlsWrapper>
            <FormControlsWrapper classes="gap-2" type="left">
              <CalendarIcon />
              <p className="text-text-secondary">
                {t('on_findout_from', { from: formatDate(mainProfile.created_at as Date) })}
              </p>
            </FormControlsWrapper>
          </div>
        </div>
      ) : (
        <div className="text-center">{t('loading')}</div>
      )}
    </div>
  );
};
