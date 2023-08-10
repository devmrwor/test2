import { useClientContext } from '@/contexts/clientContext';
import customer from '@/pages/orders/customer';
import { useQuery } from 'react-query';
import { OrderStatuses } from '../../../common/enums/order-statuses';
import { useTranslation } from 'next-i18next';

export const NotificationOrder = ({ order, setOpenNotification }) => {
  const { t } = useTranslation('orders');
  const { getUserById } = useClientContext();
  const { customer_id, status } = order;

  const { data: customerData, isLoading: customerLoading } = useQuery(
    ['customer', customer_id],
    () => getUserById(customer_id),
    {
      enabled: !!customer_id,
    }
  );

  const orderStatusColor = {
    [OrderStatuses.CREATED]: 'text-primary-100',
    [OrderStatuses.CANCELED]: 'text-red-100',
    [OrderStatuses.CLOSED]: 'text-green-100',
  };

  if (!customerData) {
    return <></>;
  }

  return (
    <div className="flex items-center mb-3.25">
      <div className="w-9.25 h-9.25 mt-1.5 bg-primary-100 text-grey-0 text-xs rounded-full flex items-center justify-center">
        {customerData.name.charAt(0)}
      </div>
      <div className="ml-2">
        <p className="text-primary-100">{customerData.name}</p>
        <p className="text-grey-100">{new Date(order.created_at).toLocaleDateString('fr-CH')}</p>
      </div>
      <div className={`ml-auto ${orderStatusColor[status]}`}>
        <span className="capitalize">{t('order')}</span> {status}
      </div>
    </div>
  );
};
