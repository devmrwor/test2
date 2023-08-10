// @ts-nocheck
import {
  LocationDot,
  Heart,
  SolidHeart,
  Star,
  Shield,
  Medal,
  CreditCard,
  Umbrella,
  Trophy,
  Rocket,
  FilledShield,
} from '@/components/Icons/Icons';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { clipLength } from '@/utils/strings';

export default function UserCard(props) {
  const { name, surname, photo, address: userAddress, tags, id, gender } = props?.user || {};
  const address = userAddress && clipLength(userAddress, 22);
  const solidColor = '#55bc7d';
  const emptyColor = '#dbdbdb';
  const [isFavorite, setIsFavorite] = useState(false);
  const {
    rating,
    reviews,
    confirm_photo,
    is_top_in_category,
    secure_deal_available,
    services_insured,
    top_executor,
    orders_completed_on_time,
  } = props.rating;
  const router = useRouter();
  const { t } = useTranslation();

  const servicesList = useMemo(() => {
    if (tags) {
      const list = tags.reduce((tot, acc, index) => {
        const comma = index === tags.length - 1 ? '' : ', ';
        return tot + acc + comma;
      }, '');
      return list.charAt(0).toUpperCase() + list.slice(1);
    }
  }, [tags]);

  const handleRedirect = () => {
    // FIXME:
    if (router.pathname.includes('/client/')) return;
    router.push(`client/${id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  const renderSurname = () => {
    if (!surname) return null;
    return `${surname?.slice(0, 1)}.`;
  };

  return (
    <div onClick={handleRedirect} className="flex flex-col py-1.5 pr-2.5 pl-2 user-card">
      <div className="flex">
        <div className="w-14.5 h-[71px] bg-background py-px rounded flex items-center justify-center shrink-0 overflow-hidden">
          <img src={photo} alt="" className="object-cover h-full" />
        </div>
        <div className="flex flex-col ml-1.5 grow">
          <h1 className="text-lg text-primary-100 leading-5">
            {name} {renderSurname()}
          </h1>
          <div className="flex  text-lg mt-1 -ml-px">
            <Star />
            <div className="ml-1 text-base">
              {rating} - {reviews} {t('reviews_left')}
            </div>
          </div>
          <div className="flex items-start text-lg ml-0.5 mt-[3px]">
            <LocationDot />
            <div className="ml-1.5 text-base text-[#b0b0b0] leading-5">{address}</div>
          </div>
        </div>
        <div className="text-[28px] ml-auto -mt-1.5 cursor-pointer" onClick={toggleFavorite}>
          {isFavorite ? <SolidHeart /> : <Heart />}
        </div>
      </div>
      <div className="h-auto text-hidden mt-px">
        <p className="leading-5 text-[#949494]">{servicesList}</p>
      </div>
      <div className="flex items-center space-x-[14px] text-[25px]">
        {confirm_photo ? <FilledShield /> : <Shield />}
        <Medal fill={is_top_in_category ? solidColor : emptyColor} />
        <CreditCard fill={secure_deal_available ? solidColor : emptyColor} />
        <Umbrella fill={services_insured ? solidColor : emptyColor} />
        <Trophy fill={top_executor ? solidColor : emptyColor} />
        <Rocket fill={orders_completed_on_time ? solidColor : emptyColor} />
      </div>
    </div>
  );
}
