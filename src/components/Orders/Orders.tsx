import { useTranslation } from 'next-i18next';
import { AddCircleIconBig, CarrotIcon } from '../Icons/Icons';
import { EmptyDataComponent } from '../Reviews/Customer/EmptyDataComponent';
import { OrderStatuses } from '../../../common/enums/order-statuses';
import { OrderCard } from './OrderCard';
import { useRouter } from 'next/router';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { ApiRoutes, ClientRoutes } from '../../../common/enums/api-routes';
import { useQuery } from 'react-query';
import { useClientContext } from '@/contexts/clientContext';
import { useState } from 'react';
import { Pagination } from '../Pagination/Pagination';
import { Roles } from '../../../common/enums/roles';
import { FilterProperty } from '../../../common/types/order-filter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather, faPepperHot } from '@fortawesome/free-solid-svg-icons';
import { Fragment } from 'preact';
import Image from 'next/image';
import Pear from '/public/Pear.svg';
import Peach from '/public/Peach.svg';
import Onion from '/public/Onion.svg';
import Link from 'next/link';

interface OrdersPageProps {
  userData: any;
  onClick: () => void;
  searchTerm: { name: string; lowest_price: string; highest_price: string };
  filters: null | FilterProperty;
}

const ORDERS_LIMIT = 4;

export const OrdersPage = ({ userData, onClick, searchTerm, filters }: OrdersPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { tab: status } = router.query;
  const { setOrderData, userType } = useClientContext();
  const [page, setPage] = useState(1);
  const [cardsQuantity, setCardsQuantity] = useState(0);

  const selectedRoleValue = userType === Roles.CUSTOMER;

  async function getAllOrders(page: number, limit: number, filter: any) {
    const currentStatus = selectedRoleValue
      ? [OrderStatuses.CREATED, OrderStatuses.IN_PROGRESS]
      : [OrderStatuses.IN_PROGRESS];
    const selectedStatus = status === OrderStatuses.CREATED ? currentStatus : [status];

    try {
      const url = new URL(
        uniteApiRoutes([
          ApiRoutes.ORDERS,
          selectedRoleValue
            ? ClientRoutes.CUSTOMER
            : // : status === OrderStatuses.CREATED
              // ? ApiRoutes.PUBLIC
              ClientRoutes.EXECUTOR,
        ])
      );
      const params = {
        page: page.toString(),
        limit: limit.toString(),
        ...filter,
      };

      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (!!value) {
          url.searchParams.append(key, value);
        }
      });

      selectedStatus.forEach((status) => {
        url.searchParams.append('status', status);
      });

      if (filters && Object.keys(filters).length) {
        Object.keys(filters).forEach((key) => {
          const value = filters[key];
          url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      setCardsQuantity(data.count);
      return data.rows;
    } catch (error) {
      console.log(error);
    }
  }

  const { data, isLoading, isError, error } = useQuery(['orders', page, userType, searchTerm, filters, status], () =>
    getAllOrders(page, ORDERS_LIMIT, { ...searchTerm })
  );

  const handleCreateOrder = () => {
    router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.CREATE_ORDER]));
  };

  const handleCardClick = (order) => {
    setOrderData(order);
    onClick();
  };

  if (isLoading) {
    return <></>;
  }

  if (!userData || !data || data.length === 0) {
    if (status === OrderStatuses.CREATED) {
      return userType === Roles.CUSTOMER ? (
        <Fragment>
          <EmptyDataComponent icon={<CarrotIcon />} heading="havent_placed_orders" text="no_orders_text" />
          <button
            onClick={handleCreateOrder}
            className="flex justify-center items-center space-x-4.5 mx-auto mt-10 w-67.5 py-1.25 mb-20 bg-primary-100 rounded"
          >
            <div>
              <AddCircleIconBig fill="#fff" width={25} height={25} />
            </div>
            <span className="text-lg text-grey-0">{t('place_order')}</span>
          </button>
        </Fragment>
      ) : (
        <Fragment>
          <EmptyDataComponent
            icon={<Image src={Pear} alt="pear" height={71} />}
            heading="orders_page.executor.empty.current.heading"
            text="orders_page.executor.empty.current.text"
          />
          <Link
            className="flex justify-center items-center space-x-4.5 mx-auto mt-10 w-67.5 py-1.25 mb-20 bg-primary-100 rounded"
            href={uniteRoutes([ClientRoutes.ORDER])}
          >
            <div>
              <AddCircleIconBig fill="#fff" width={25} height={25} />
            </div>
            <span className="text-lg text-grey-0">{t('orders_page.executor.empty.current.button')}</span>
          </Link>
        </Fragment>
      );
    } else if (status === OrderStatuses.CLOSED) {
      return userType === Roles.CUSTOMER ? (
        <div>
          <EmptyDataComponent
            icon={<FontAwesomeIcon icon={faPepperHot} size="4x" color="#b0b0b0" />}
            heading="orders_closed_message"
          />
          {selectedRoleValue && (
            <button
              onClick={handleCreateOrder}
              className="flex justify-center items-center space-x-4.5 mx-auto mt-10 w-67.5 py-1.25 mb-20 bg-primary-100 rounded"
            >
              <div>
                <AddCircleIconBig fill="#fff" width={25} height={25} />
              </div>
              <span className="text-lg text-grey-0">{t('place_order')}</span>
            </button>
          )}
        </div>
      ) : (
        <EmptyDataComponent
          icon={<Image src={Peach} alt="pear" height={71} />}
          heading="orders_page.executor.empty.closed.heading"
        />
      );
    } else if (status === OrderStatuses.CANCELED) {
      return userType === Roles.CUSTOMER ? (
        <div>
          <EmptyDataComponent
            icon={<FontAwesomeIcon icon={faFeather} size="4x" color="#b0b0b0" />}
            heading="orders_canceled_message"
          />
          {selectedRoleValue && (
            <button
              onClick={handleCreateOrder}
              className="flex justify-center items-center space-x-4.5 mx-auto mt-10 w-67.5 py-1.25 mb-20 bg-primary-100 rounded"
            >
              <div>
                <AddCircleIconBig fill="#fff" width={25} height={25} />
              </div>
              <span className="text-lg text-grey-0">{t('place_order')}</span>
            </button>
          )}
        </div>
      ) : (
        <EmptyDataComponent
          icon={<Image src={Onion} alt="pear" height={71} />}
          heading="orders_page.executor.empty.canceled.heading"
        />
      );
    }
  }

  return (
    userData &&
    data &&
    data.length && (
      <div className=" mt-7  pb-10">
        {data.map((order) => (
          <div key={order.id} onClick={() => status === OrderStatuses.CREATED && handleCardClick(order)}>
            <OrderCard userData={userData} order={order} customer={selectedRoleValue} />
          </div>
        ))}
        {selectedRoleValue && (
          <button
            onClick={handleCreateOrder}
            className="flex justify-center items-center space-x-4.5 mx-auto mt-10 w-67.5 py-1.25 mb-20 bg-primary-100 rounded"
          >
            <div>
              <AddCircleIconBig fill="#fff" width={25} height={25} />
            </div>
            <span className="text-lg text-grey-0">{t('place_order')}</span>
          </button>
        )}
        {!isLoading && data.length > 0 && (
          <div className="mt-6.75 flex items-center justify-center">
            <Pagination
              page={page}
              count={Math.ceil(cardsQuantity / ORDERS_LIMIT)}
              onChange={(event, page) => setPage(page)}
              sx={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </div>
        )}
      </div>
    )
  );
};
