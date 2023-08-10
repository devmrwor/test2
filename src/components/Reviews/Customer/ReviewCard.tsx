import { useTranslation } from 'next-i18next';
import { DollarIcon, LocationIconSmall, CreditCard } from '@/components/Icons/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { light, rating } from '@/themes/colors';
import { MuiRating } from '@/components/RatingBlocks/MuiRating';
import Image from 'next/image';
import face from '../../../../public/assets/images/Face_man_1.svg';

interface ReviewCardProps {
  review: {
    executor: string;
    service_name: string;
    currency: string;
    price: number;
    address: string;
    date_of_service: string;
  };
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const { t } = useTranslation();
  const { executor, service_name, currency, price, address, date_of_service } = review;
  return (
    <div className="h-36.25 w-full flex flex-col justify-between mb-6 pl-2.75 pt-1.5 pr-2 pb-[11.8px] shadow-[4px_4px_10px_0_rgba(0,0,0,0.2)] rounded">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg">{service_name}</h2>
          <div className="flex items-center mt-1.25 mb-1.75">
            <DollarIcon />
            <div className="ml-3.25 font-bold flex items-center">
              {t('up_to')} {currency}
              {price}
              <div className="ml-2.5 text-lg">
                <CreditCard fill="55bc7d" />
              </div>
            </div>
          </div>
          <div className="flex items-center mt-1.25 mb-1.75">
            <LocationIconSmall />
            <div className="ml-3.25">{address}</div>
          </div>
        </div>
        {/*<div className="w-10.5 h-12.75 bg-background"></div>*/}
        <Image className="rounded w-10.5 h-12.75" src={face} alt="avatar" />
      </div>
      <div className="flex items-end justify-between">
        <div className="flex text-3xl space-x-2.25">
          <MuiRating
            defaultValue={3}
            size="small"
            emptyIcon={<FontAwesomeIcon icon={faStar} color={light.value} size="xl" />}
            icon={<FontAwesomeIcon icon={faStar} color={rating.value} size="xl" />}
            className="gap-2"
            readOnly
          />
        </div>
        <div className="mr-[12.8px] text-text-secondary leading-3">{date_of_service}</div>
      </div>
    </div>
  );
};
