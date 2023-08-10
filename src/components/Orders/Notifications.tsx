import { useTranslation } from 'next-i18next';
import { BackHeader } from '../primitives/BackHeader/BackHeader';
import { useState, useEffect } from 'react';
import { Roles } from '../../../common/enums/roles';
import { SegmentedControl } from '@mantine/core';
import { BellIconXl } from '../Icons/Icons';
import { EmptyDataComponent } from '../Reviews/Customer/EmptyDataComponent';
import { useQuery } from 'react-query';
import { ApiRoutes } from '../../../common/enums/api-routes';
import { uniteApiRoutes } from '@/utils/uniteRoute';
import { NotificationOrder } from './NotificationOrder';
import { SegmentedControls } from '../primitives/SegmentedControl/SegmentedControl';
import { useClientContext } from '@/contexts/clientContext';
import { NotificationCard } from './NotificationCard';
import { Preview } from '@mui/icons-material';

//FIXME: remove this mock
const DATA = [
  {
    address: '026 Brannon Parkway',
    cancel_comment: null,
    category_id: 1,
    created_at: '2023-07-11T08:43:21.564Z',
    customer_id: 3,
    date: null,
    deletedAt: null,
    description: 'Amet et minus nemo aut quae sint.',
    executor: {
      id: 31,
      role: 'administrator',
      name: 'Alec',
      username: 'Elmore90',
      surname: 'Balistreri',
    },
    executor_id: 31,
    id: 30,
    name: 'est et',
    payment_method: 'cash',
    photos: null,
    place: null,
    price_to: null,
    profile_id: 9,
    statistic: null,
    status: 'canceled',
    status_date: null,
    type: null,
    updated_at: '2023-07-11T08:43:21.564Z',
  },
  {
    address: '026 Brannon Parkway',
    cancel_comment: null,
    category_id: 1,
    created_at: '2023-07-11T08:43:21.564Z',
    customer_id: 3,
    date: null,
    deletedAt: null,
    description: 'Amet et minus nemo aut quae sint.',
    executor: {
      id: 31,
      role: 'administrator',
      name: 'Alec',
      username: 'Elmore90',
      surname: 'Balistreri',
    },
    executor_id: 31,
    id: 30,
    name: 'est et',
    payment_method: 'cash',
    photos: null,
    place: null,
    price_to: null,
    profile_id: 9,
    statistic: null,
    status: 'closed',
    status_date: null,
    type: null,
    updated_at: '2023-07-11T08:43:21.564Z',
  },
];

export const Notifications = ({ onBackClick }) => {
  const { t } = useTranslation();
  const { userType } = useClientContext();
  const [openNotification, setOpenNotification] = useState(false);

  const getAllOrdersByRole = async (page: number, limit: number, role: string) => {
    try {
      const url = new URL(uniteApiRoutes([ApiRoutes.ORDERS, ApiRoutes.MY, role]));
      const params = {
        page: page.toString(),
        limit: limit.toString(),
      };

      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

      const response = await fetch(url.toString());
      const data = await response.json();
      return data.rows;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading } = useQuery(['orders', userType], () => getAllOrdersByRole(1, 100000, userType));

  const handleOpenNotification = () => {
    setOpenNotification((prev) => !prev);
  };

  if (openNotification) {
    return <NotificationCard />;
  }

  return (
    <div>
      <BackHeader onClick={onBackClick} heading="notifications" classes="pl-2.25 mt-2.75" />
      <div className="mt-3.75 pl-4.25 pr-2.75">
        <SegmentedControls />
        <div>
          {DATA.length ? (
            <div className="mt-6.5">
              {DATA.map((order, i) => (
                <NotificationOrder key={i} order={order} setOpenNotification={handleOpenNotification} />
              ))}
            </div>
          ) : (
            <EmptyDataComponent
              icon={<BellIconXl width="55" height="63" />}
              heading="there_is_nothing"
              text="notifications_stored_here"
              additionalText="we_will_notify_you"
              textDark={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};
