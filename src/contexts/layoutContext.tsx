import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { IBreadcrumb } from '../../common/types/breadcrumb';
import NotificationContainer from '@/components/NotificationContainer/NotificationContainer';
import { NOTIFICATION_DISAPPEAR_TIME } from '../../common/constants/notifications';
import { v4 as uuidv4 } from 'uuid';

interface LayoutContextValue {
  breadcrumbs: IBreadcrumb[];
  setBreadcrumbs: Dispatch<SetStateAction<IBreadcrumb[]>>;
  removeNotificationById: (id: string) => void;
  addNotification: (data: Notification) => void;
  notifications: Notification[];
}

interface Notification {
  id?: string;
  type: NotificationType;
  text: string;
}

type NotificationType = 'success' | 'error';

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export const LayoutProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumb[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (data: Notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, { ...data, id: uuidv4() }]);
  };

  const removeNotification = (index: number) => {
    setNotifications((prevNotifications) => prevNotifications.filter((_, i) => i !== index));
  };

  const removeAllNotifications = () => {
    setNotifications([]);
  };

  const removeNotificationById = (id: string) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications.length > 0) {
        // removeNotification(0);
        removeAllNotifications();
      }
    }, NOTIFICATION_DISAPPEAR_TIME);
    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <LayoutContext.Provider
      value={{
        breadcrumbs,
        setBreadcrumbs,
        notifications,
        addNotification,
        removeNotificationById,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
