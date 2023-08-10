import { BackHeader } from '../primitives/BackHeader/BackHeader';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ClientRoutes } from '../../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';
import { Divider } from '../primitives/Divider';
import { PartyHorn } from '../Icons/Icons';
import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiRoutes } from '../../../common/enums/api-routes';
import { OrderStatuses } from '../../../common/enums/order-statuses';
import { toast } from 'react-toastify';

interface ConfirmationPageProps {
  handleBack: () => void;
  order: any;
  closeCard?: () => void;
  customer?: boolean;
}

export const ConfirmationPage = ({ handleBack, order, closeCard, customer = false }: ConfirmationPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { name, id, created_at: orderDate, status } = order;
  const date = orderDate ? new Date(orderDate).toLocaleDateString('fr-CH') : '';

  const onBackClick = () => {
    if (customer) {
      handleBack();
      return;
    }
    router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.ORDERS]));
  };

  const closeOrder = async () => {
    if (status === OrderStatuses.IN_PROGRESS) {
      toast.error(t('order_already_in_progress'));
      return;
    }
    try {
      const updateOrderPromise = fetch(uniteApiRoutes([ApiRoutes.ORDERS, id]), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: OrderStatuses.CLOSED,
        }),
      });
      const response = await updateOrderPromise;
      if (response.ok) {
        toast.success(t('order_closed_successfully'));
        handleBack();
        closeCard();
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <BackHeader heading={t('confirmation')} onClick={onBackClick} classes="pl-2 mt-1.75" />
      <Divider classes="mt-3.25 mb-4.25" />
      <div className="pl-6.5 pr-5.25">
        <div className="w-29.25 h-29.25 bg-background mb-5.75 rounded-full mx-auto flex items-center justify-center">
          {<PartyHorn />}
        </div>
        {customer ? <p>{t('message_of_confirmation_customer')}</p> : <p>{t('message_of_confirmation')}</p>}
        <div className="text-lg text-text-secondary">{name}</div>
        <div className="text-text-secondary">
          {t('order_number')}:<span className="ml-2">{id}</span>
        </div>
        <div className="text-text-secondary">
          {t('order_date')}:<span className="ml-2">{date}</span>
        </div>
        {customer ? null : (
          <div>
            <p className="mt-6.75 text-text-secondary">{t('confirmation_explanation_message')}</p>
            <p className="mt-2.5 text-text-secondary">{t('confirmation_explanation_message_two')}</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-10">
          <button
            onClick={customer ? closeOrder : onBackClick}
            className="w-full pt-1.5 pb-2.25 text-lg text-grey-0 bg-green-100 rounded border border-green-100 mr-4.5"
          >
            {t('ok')}
          </button>
          <button
            onClick={onBackClick}
            className="w-full pt-1.5 pb-2.25 text-lg text-text-secondary rounded border border-darken-background"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </>
  );
};
