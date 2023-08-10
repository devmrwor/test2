import { PartyHorn } from '../Icons/Icons';
import { BackHeader } from '../primitives/BackHeader/BackHeader';
import { Divider } from '../primitives/Divider';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

export const OrderPreview = ({ order, createOrder, handleBack, userName }) => {
  const { t } = useTranslation();
  const { name } = order;
  const [disabled, setDisabled] = useState(false);
  return (
    <>
      <BackHeader onClick={handleBack} heading="confirmation" classes="pl-2.5 mt-3" />
      <Divider classes="mt-3.25 mb-4.25" />
      <div className="w-29.25 h-29.25 bg-background mb-5.75 rounded-full mx-auto flex items-center justify-center">
        <PartyHorn />
      </div>
      <div className="mt-2.75 pl-6.75 text-text-secondary text-lg">
        <p>{t('your_order')}:</p>
        <p>{name}</p>
        <p className="text-base mt-1.75">{t('order')}: №000000000</p>
        <p className="text-base">
          {t('date_of_publishing')}: {new Date().toLocaleDateString('fr-CH')}
        </p>
        <p className="mt-6 text-text-primary">{t('will_be_published')}:</p>
        <p className="text-text-primary font-bold">{userName}</p>
      </div>
      <div className="mt-10.25 pl-6 pr-4 flex justify-between items-center text-lg">
        <button
          onClick={handleBack}
          className="w-full py-1.25 text-text-secondary border border-darken-background rounded mr-4"
        >
          {t('cancel')}
        </button>
        <button
          disabled={disabled}
          onClick={() => {
            setDisabled(true);
            createOrder(order);
          }}
          className={`w-full py-1.25 text-grey-0  border  rounded ${
            disabled ? 'bg-darken-background border-darken-background' : 'bg-green-100 border-green-100'
          }`}
        >
          {t('ok')}
        </button>
      </div>
    </>
  );
};
