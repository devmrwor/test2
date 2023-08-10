import { DoubleRoundedBtn } from '../Buttons/DoubleRoundedBtn';
import { BackHeader } from '../primitives/BackHeader/BackHeader';
import { Preview } from '../../../common/enums/preview';
import React, { useState } from 'react';
import {
  DollarSignIcon,
  CreditCardIcon,
  LocationDotExtended,
  CalendarRegularIcon,
  UserIconBottom,
  SolidHeart,
  Heart,
  EyeIcon,
  Comment,
} from '../Icons/Icons';
import { useTranslation } from 'next-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faEllipsis, faShare } from '@fortawesome/free-solid-svg-icons';
import { Divider } from '@/components/primitives/Divider';

export const PreviewPage = ({ order, handleBack }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string>(Preview.SHORT);
  const [isFavorite, setIsFavorite] = useState(false);
  const { name, price_to: taskPrice, address, date: taskDate, description, type } = order;

  const price = taskPrice ?? '';
  const date = taskDate
    ? new Date(taskDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const today = new Date().toLocaleDateString('fr-CH');

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div>
      <BackHeader
        onClick={handleBack}
        buttonContent={<FontAwesomeIcon icon={faEllipsis} size="xl" />}
        heading="order_preview"
        classes="px-2.5 mt-3 mb-7.75"
      >
        <button className="text-base leading-7 text-primary-100">
          <FontAwesomeIcon icon={faArrowUpFromBracket} size="xl" />
        </button>
      </BackHeader>
      <DoubleRoundedBtn
        firstVal={{ value: Preview.SHORT, text: Preview.SHORT }}
        secondVal={{ value: Preview.DETAILED, text: Preview.DETAILED }}
        selectedValue={preview}
        onChange={(value) => setPreview(value)}
        classes="pl-4.75 pr-3.5"
      />
      {preview === Preview.SHORT ? (
        <div className="mx-3 mt-6.5 mb-2 shadow-[4px_4px_10px_0_rgba(0,0,0,0.2)] rounded">
          <div className="flex justify-between pl-3.5 pt-1.5 pr-2.75">
            <div>
              <h1 className="text-lg text-primary-100">{name}</h1>
              <div className="flex items-center mt-1.25 mb-1.5">
                <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full">
                  <DollarSignIcon />
                </div>
                <div className="ml-3.25 font-bold flex items-center">
                  {t('up_to')} ${price}
                  <div className="ml-2.5 text-lg text-green-100">
                    <CreditCardIcon fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-1.25 mb-1.5">
                <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full">
                  <LocationDotExtended size="sm" />
                </div>
                <div className="ml-2.5">{address}</div>
              </div>
              <div className="flex items-center mt-2 mb-1.75">
                <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full">
                  <CalendarRegularIcon width={9} height={10} />
                </div>
                <div className="ml-2.5">{date}</div>
              </div>
            </div>

            <div className="text-[28px] ml-auto -mt-1.5 cursor-pointer" onClick={toggleFavorite}>
              {isFavorite ? <SolidHeart /> : <Heart />}
            </div>
          </div>
          <div className="flex justify-between items-center mb-1.75 pl-3.5 pr-2.75 pb-1.5">
            <div className="flex items-center ">
              <p className="w-5 h-5 bg-darken-background text-text-secondary flex items-center justify-center rounded-full">
                {t('user_name_symbol')}
              </p>
              <div className="ml-2.5">{t('user_name')}</div>
            </div>
            <p className="text-toggle-background">{today}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center pl-6.25 pr-2.75 mt-6.75">
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className=" flex items-center justify-center w-6.25 h-6.25 mr-2 bg-green-100 text-grey-0 rounded-full">
                  {t('user_name_symbol')}
                </div>
                <p className="text-primary-100 text-lg">{t('user_name')}</p>
              </div>
              <div className="text-toggle-background">{today}</div>
            </div>
            <div className="text-[28px] ml-auto -mt-1.5 cursor-pointer" onClick={toggleFavorite}>
              {isFavorite ? <SolidHeart /> : <Heart />}
            </div>
          </div>
          <div className="pl-6.25 pr-2.75 mt-3.25">
            <h1 className="text-lg">{capitalize(name)}</h1>
            <div className="flex items-center mt-1.25 mb-1.5">
              <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full">
                <DollarSignIcon />
              </div>
              <div className="ml-2.75 font-bold flex items-center">
                {t('up_to')} ${price}
                <div className="ml-2.5 text-lg">
                  <CreditCardIcon />
                </div>
              </div>
            </div>
            <div className="flex items-center mt-1.25 mb-1.5">
              <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full">
                <LocationDotExtended size="sm" />
              </div>
              <div className="ml-2.5">{address}</div>
            </div>
            <div className="flex items-center mt-1.25 mb-1.75">
              <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full">
                <CalendarRegularIcon width={9} height={10} />
              </div>
              <div className="ml-2.5">{date}</div>
            </div>
            <div className="flex items-center mt-1.25 mb-1.75">
              <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full text-[14px]">
                <UserIconBottom />
              </div>
              <p className="ml-2.5">
                {t('customer')}: {t(type)}
              </p>
            </div>
            <button className="text-primary-100 my-2.75">{t('build_route')}</button>
            <p>
              <span className="font-bold">{t('description')}: </span>
              {description}
            </p>
            <Divider classes="mt-6.75 mb-3.5" />
            <div>
              <h2 className="text-xl font-bold mb-3">{t('statistics')}</h2>
              <div className="flex items-center mb-2">
                <EyeIcon size="lg" />
                <span className="text-green-100 mx-3">0</span>
                <span className="capitalize">{t('views', { count: '' })}</span>
              </div>
              <div className="text-green-100 flex items-center pl-0.75 mb-3">
                <Comment fill="currentColor" size="lg" />
                <span className="mx-3 leading-5">{0}</span>
                <span className="text-text-primary">{t('offers')}</span>
              </div>
              <div className="text-green-100 flex items-center pl-0.75 mb-3">
                <SolidHeart size="lg" />
                <span className="mx-3">{0}</span>
                <span className="text-text-primary ">{t('added_to_favorite')}</span>
              </div>
              <p className="text-toggle-background">{t('order_number')}: 00000</p>
            </div>
            {/*<button className="w-full mt-4.75 py-1.25 bg-green-100 text-grey-0 border border-green-100 rounded">*/}
            {/*  <span className="mr-2"></span>*/}
            {/*  {t('reply_to_offer')}*/}
            {/*</button>*/}
            <Divider classes="mt-6.75 mb-3.5" />
            <button
              type="button"
              disabled
              className="w-full mt-4 py-1.25 text-text-secondary border border-secondary-100 rounded"
            >
              <span className="mr-2">
                <Comment fill="currentColor" size="lg" />
              </span>
              {t('go_to_chats')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
