import { BackHeader } from '../primitives/BackHeader/BackHeader';
import { useTranslation } from 'next-i18next';

import {
  ChevronLeft,
  ShareArrow,
  Feather,
  Star,
  Envelope,
  CircleCheck,
  LocationDotBig,
  TelegramIcon,
  WhatsAppIcon,
  Phone,
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  CalendarIcon,
} from '../Icons/Icons';
import { useClientContext } from '@/contexts/clientContext';
import { Rating } from '../primitives/Rating';
import { date } from 'joi';
import { CustomerTypes } from '../../../common/enums/customer-type';

function formatName(name: string, surname: string) {
  return `${name || ''} ${surname ? surname.charAt(0).toUpperCase() + '.' : ''}`.trim();
}

export const ProfilePreview = () => {
  const { t } = useTranslation();
  const { setShowProfilePreview, userData } = useClientContext();

  const handleBack = () => {
    setShowProfilePreview(false);
  };

  const formatDate = (value: string) => {
    if (value) {
      const date = new Date(value);
      const formattedDate = date.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit' });
      return formattedDate;
    }
    return '';
  };

  return (
    <>
      <BackHeader
        heading="profile_preview"
        onClick={handleBack}
        buttonContent={<ShareArrow />}
        classes="pl-[12.6px] pr-5 pt-2.25"
      />
      <div className="mt-[38.35px] pl-[25.77px] pr-5 text-text-secondary">
        <div className="flex justify-between">
          <div>
            <h2 className="text-lg font-bold leading-5 text-text-primary">
              {userData.type === CustomerTypes.INDIVIDUAL
                ? formatName(userData.name, userData.surname)
                : userData.company_name}
            </h2>
            <div className="mt-[5.7px] capitalize">{t(userData.type)}</div>
            <div className="mt-2.25 leading-5">{t('profile_number')}</div>
            <div>{userData.id}</div>
          </div>
          <div className="w-24 h-25 rounded-full bg-primary-100">
            {userData.photo ? <img src={userData.photo} className="w-full h-full rounded-full object-cover" /> : null}
          </div>
        </div>
        <Rating rating={userData.statistic?.reviews_rating || 0} reviews={userData.statistic?.reviews_count || 0} />
        <div className="flex items-center mt-2.75 text-2xl">
          <Feather fill="#949494" />
          <span className="text-base ml-1.75 mr-0.5">{userData.statistic?.orders || 0}</span>
          <div className="text-base">{t('orders_placed_by_customer')}</div>
        </div>
        <div className="flex items-center mt-2.75 text-2xl">
          <Star fill="#949494" />
          <span className="text-base ml-1.75 mr-0.5">{userData.statistic?.reviews_count || 0}</span>
          <div className="text-base">{t('feedbacks_left')}</div>
        </div>
        <h3 className="text-lg text-text-primary mt-[26.4px]">{t('coordinates')}</h3>
        <div className="flex items-center mt-[9.5px]">
          <Envelope size="xl" />
          <div className="text-primary-100 ml-1.75 mr-auto">{userData.email}</div>
          <CircleCheck fill={userData.is_email_verified ? '#55bc7d' : '#949494'} />
        </div>
        {userData.show_address_publicly ? (
          <div className="flex items-center mt-3.25 ml-0.75">
            <LocationDotBig fill="#949494" />
            <div className="text-primary-100 ml-2.75 mr-auto">{userData.address}</div>
          </div>
        ) : null}
        {userData.show_messengers &&
          userData.messengers
            ?.filter((messenger) => messenger.nicknameOrNumber)
            .map((messenger) => (
              <div
                key={`${messenger.messenger.id}${messenger.nicknameOrNumber}`}
                className="flex items-center mt-4.25 ml-0.75"
              >
                {messenger.messenger.id === 1 && <TelegramIcon fill="#949494" width="20" height="20" />}
                {messenger.messenger.id === 2 && <WhatsAppIcon fill="#949494" width="20" height="20" />}
                {messenger.messenger.id === 3 && <FacebookIcon fill="#949494" width="20" height="20" />}
                {messenger.messenger.id === 4 && <InstagramIcon fill="#949494" width="20" height="20" />}
                {messenger.messenger.id === 5 && <TwitterIcon fill="#949494" width="20" height="20" />}
                <div className="text-primary-100 ml-2.75 mr-auto">{messenger.nicknameOrNumber}</div>
                <CircleCheck fill={messenger.confirmed ? '#55bc7d' : '#949494'} />
              </div>
            ))}
        {userData.phone ? (
          <div className="flex items-center mt-[18.5px] ml-1 text-[20px]">
            <Phone fill="#949494" />
            <div className="text-primary-100 ml-2.75 mr-auto text-base">{userData.phone}</div>
          </div>
        ) : null}
        <div className="flex items-center mt-[18.5px] ml-1">
          <CalendarIcon fill="currentColor" />
          <span className="ml-2.5 pt-0.5">{t('on_platform_from')}</span>
          <div className="ml-2.75 mr-auto pt-0.5">
            {formatDate(userData.created_at)} <span>{t('year')}</span>
          </div>
        </div>
        <button className="w-full bg-green-100 text-white rounded pt-2.25 pb-2 mt-[26.6px]">
          {t('message_to_chat')}
        </button>
      </div>
    </>
  );
};
