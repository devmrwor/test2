import { useClientContext } from '@/contexts/clientContext';
import { BackHeader } from '../primitives/BackHeader/BackHeader';
import { Divider } from '../primitives/Divider';
import React, { useState, useEffect } from 'react';
import {
  SolidHeart,
  Heart,
  DollarSignIcon,
  CreditCardIcon,
  LocationDotExtended,
  CalendarRegularIcon,
  UserIconBottom,
  EyeIcon,
  Comment,
  Phone,
} from '../Icons/Icons';
import { useTranslation } from 'next-i18next';
import { ApiRoutes, ClientRoutes } from '../../../common/enums/api-routes';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { useRouter } from 'next/router';
import { Roles } from '../../../common/enums/roles';
import { OrderStatuses } from '../../../common/enums/order-statuses';
import { useQuery } from 'react-query';
import customer from '@/pages/orders/customer';
import { toast } from 'react-toastify';
import { ConfirmationPage } from './ConfirmationPage';

function createGoogleMapsLink(address) {
  const urlAddress = encodeURIComponent(address);
  const link = `https://www.google.com/maps/dir/?api=1&destination=${urlAddress}&travelmode=driving`;
  return link;
}

export const DetailedOrderCard = ({ order, userData, userRole, onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { orderData, getUserById } = useClientContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const {
    created_at: createdAt,
    name,
    address,
    date: taskDate,
    price_to,
    type,
    description,
    statistic,
    id,
    customer_id,
  } = order ?? orderData;
  const created = createdAt && new Date(createdAt).toLocaleDateString('fr-CH');
  const date =
    taskDate && taskDate.startDate
      ? new Date(taskDate.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '';

  const views = statistic ? statistic?.views : 0;
  const selectedRoleValue = userRole === Roles.CUSTOMER;

  const [userName, setUserName] = useState(userData?.name || '');
  const [closeOrder, setCloseOrder] = useState(false);

  const { data: customerData, isLoading } = useQuery(['customer', customer_id], () => getUserById(customer_id), {
    enabled: !selectedRoleValue,
  });

  const toggleFavorite = (e: React.SyntheticEvent<EventTarget>) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleEditOrder = () => {
    router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.CREATE_ORDER], { orderStatus: 'edit' }));
  };

  const handleChangeOrderStatus = (status: string) => {
    router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.CLOSE_ORDER], { orderChange: status, id }));
  };

  const goToChatsHandler = async () => {
    const body = JSON.stringify({
      order_id: id,
    });

    const res = await fetch(uniteApiRoutes([ApiRoutes.CHAT]), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (res.ok) {
      const chat = await res.json();
      router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.CHAT, chat.id]));
    } else {
      const error = await res.json();
      toast.error(error.message);
    }
  };

  const goToChats = () => {
    router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.CHATS]));
  };

  useEffect(() => {
    if (!selectedRoleValue && customerData) {
      setUserName(customerData.name);
      return;
    }
    if (userData) setUserName(userData.name);
  }, [customerData]);

  const handleCloseOrder = () => {
    setCloseOrder((prev) => !prev);
  };

  if (closeOrder) {
    return <ConfirmationPage handleBack={handleCloseOrder} order={orderData} closeCard={onClick} customer={true} />;
  }

  return (
    <div>
      <BackHeader onClick={onClick} heading="current" classes="pl-2.75 mt-3" />
      <div className="flex justify-between items-center px-2.75 mt-2">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className=" flex items-center justify-center w-6.25 h-6.25 mr-2 bg-green-100 text-grey-0 rounded-full">
              {userName.charAt(0)}
            </div>
            <p className="text-primary-100 text-lg">{userName}</p>
          </div>
          <div className="text-toggle-background mt-1">{created}</div>
        </div>
        <div className="text-[28px] ml-auto self-start cursor-pointer" onClick={toggleFavorite}>
          {isFavorite ? <SolidHeart /> : <Heart />}
        </div>
      </div>
      <div className="px-2.75 mt-3.25">
        <h1 className="text-lg capitalize">{name}</h1>
        <div className="flex items-center mt-1.25 mb-1.5">
          <div className="w-5 h-5 bg-darken-background flex items-center justify-center rounded-full">
            <DollarSignIcon />
          </div>
          <div className="ml-2.75 font-bold flex items-center">
            {price_to ? (
              <span>
                {t('up_to')} {price_to}
              </span>
            ) : (
              <span>{t('negotiable')}</span>
            )}
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
        {address ? (
          <a href={createGoogleMapsLink(address)} target="_blank" className="text-primary-100 my-2.75">
            {t('build_route')}
          </a>
        ) : null}
        <p>
          <span className="font-bold">{t('description')}: </span>
          {description}
        </p>
      </div>
      <Divider classes="mt-6.75 mb-3.5" />
      <div className="pl-6.5 pr-5.25">
        <h2 className="text-xl font-bold">{t('statistics')}</h2>
        <div className="flex items-center mb-2">
          <EyeIcon size="lg" />
          <span className="text-green-100 mx-3">{views}</span>
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
        <p className="text-toggle-background">
          {t('order_number')}: {id}
        </p>
      </div>
      <Divider classes="my-6.75" />
      <div className="px-2.75 mb-8">
        {selectedRoleValue && !order ? (
          <div className="flex items-center mb-7">
            <button
              onClick={handleEditOrder}
              className="w-full py-1 text-primary-100 border border-primary-100 rounded mr-2"
            >
              {t('edit')}
            </button>
            <button
              onClick={handleCloseOrder}
              className="w-full py-1 text-primary-100 border border-primary-100 rounded"
            >
              {t('not_relevant')}
            </button>
          </div>
        ) : // <button className="w-full text-primary-100 py-1.25 mb-6 border border-primary-100 rounded">
        //   <span className="mr-2">
        //     <Phone fill="currentColor" />
        //   </span>
        //   {t('call')}
        // </button>
        !order ? (
          <div className="flex justify-between items-center mb-7">
            <button
              onClick={() => handleChangeOrderStatus(OrderStatuses.CLOSED)}
              className="w-full mr-5.75 py-1.75 text-grey-0 bg-green-100 text-sm rounded"
            >
              {t('close_order')}
            </button>
            <button
              onClick={() => handleChangeOrderStatus(OrderStatuses.CANCELED)}
              className="w-full  py-1.75 text-grey-0 bg-primary-100 text-sm rounded"
            >
              {t('cancel_order')}
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={
            userData?.id === orderData?.customer_id || userRole === Roles.EXECUTOR ? goToChats : goToChatsHandler
          }
          className="w-full py-1.25 bg-green-100 text-grey-0 border border-green-100 rounded"
        >
          <span className="mr-2">
            <Comment fill="currentColor" size="lg" />
          </span>
          {t('go_to_chats')}
        </button>
      </div>
    </div>
  );
};
