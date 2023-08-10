import { useTranslation } from 'next-i18next';
import {
  LocationDotExtended,
  CalendarRegularIcon,
  CreditCardIcon,
  DollarSignIcon,
  EyeIcon,
  Comment,
} from '@/components/Icons/Icons';
import { OrderStatuses } from '../../../common/enums/order-statuses';
import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiRoutes } from '../../../common/enums/api-routes';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { useClientContext } from '@/contexts/clientContext';
import { clipLength } from '@/utils/strings';

interface OrderCardProps {
  order: {
    id: number;
    name: string;
    address: string;
    price_to: string;
    date: {
      startDate: string;
      endDate: string;
    };
    statistic: {
      views: number;
    };
    status: string;
    created_at: string;
    customer_id: number;
  };
}

export const OrderCard = ({ userData, order, customer }: OrderCardProps) => {
  const { t } = useTranslation();
  const { getUserById } = useClientContext();

  const {
    id,
    name,
    address,
    price_to: taskPrice,
    date: taskDate,
    statistic,
    status,
    created_at: createdAt,
    customer_id,
  } = order;

  const date =
    taskDate && taskDate.startDate
      ? new Date(taskDate.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '';

  const price = taskPrice ?? '';
  const views = statistic ? statistic?.views : 0;
  const created = createdAt && new Date(createdAt).toLocaleDateString('fr-CH');
  // FIXME: add comments to order model
  const comments = 0;
  const [userName, setUserName] = useState('');

  const { data: customerData, isLoading } = useQuery(['customer', customer_id], () => getUserById(customer_id), {
    enabled: !customer,
  });

  useEffect(() => {
    if (!customer && customerData) {
      setUserName(customerData.name);
      return;
    }
    setUserName(userData.name);
  }, [customerData]);

  if (isLoading) {
    return <></>;
  }

  return (
    <div key={id} className="flex flex-col justify-between my-5 p-2 shadow-[0px_0px_6px_1px_rgba(0,0,0,0.3)] rounded">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg text-primary-100">{name}</h2>
          <div className="flex items-center mt-1.25 mb-1.5">
            <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full">
              <DollarSignIcon />
            </div>
            <div className="ml-2.25 font-bold flex items-center">
              {/*{t('up_to')} ${price}*/}
              {price ? (
                <span>
                  {t('up_to')} {price}
                </span>
              ) : (
                <span>{t('negotiable')}</span>
              )}
              <div className="ml-2.5 text-lg">
                <CreditCardIcon />
              </div>
            </div>
          </div>
          <div className="flex items-center my-1.5">
            <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full">
              <LocationDotExtended size="sm" />
            </div>
            <div className="ml-2.5">{clipLength(address, 30)}</div>
          </div>
          <div className="flex items-center mt-1.25 mb-1.75">
            <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full">
              <CalendarRegularIcon width={9} height={10} />
            </div>
            <div className="ml-2.5">{date}</div>
          </div>
        </div>
        <div className="w-9.25 h-9.25 mt-1.5 bg-primary-100 text-grey-0 text-xl rounded-full flex items-center justify-center">
          {userName.charAt(0)}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-4.75">
          <div>
            <EyeIcon size="lg" />
            <span className="text-green-100 ml-1">{views}</span>
          </div>
          <div className="text-green-100">
            <Comment fill="currentColor" size="lg" />
            <span className="ml-1">{comments}</span>
          </div>
        </div>
        {status !== OrderStatuses.CLOSED && status !== OrderStatuses.CANCELED && (
          <div className="bg-primary-50 py-0.5 px-2 text-text-secondary rounded ">
            {t('created')}: {created}
          </div>
        )}
        {status === OrderStatuses.CLOSED && (
          <div className="bg-green-50 py-0.5 px-1 text-text-secondary">
            {t('closed')}: {created}
          </div>
        )}
        {status === OrderStatuses.CANCELED && (
          <div className="bg-red-50 py-0.5 px-1 text-text-secondary">
            {t('cancelled')}: {created}
          </div>
        )}
      </div>
    </div>
  );
};
