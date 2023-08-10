import { useLayout } from '@/contexts/layoutContext';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { SuccessIcon, TriangleWarningIcon, XMarkMd } from '../Icons/Icons';

const NotificationContainer = () => {
  const { notifications, removeNotificationById } = useLayout();

  return ReactDOM.createPortal(
    <div className="fixed top-0 right-0 m-4 z-[999999999]">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={classNames('px-4 py-3.5 rounded-md my-2 flex items-center w-notification border justify-between', {
            'bg-green-50 border-green-100': notification.type === 'success',
            'bg-red-50 border-red-100': notification.type === 'error',
          })}
        >
          <div className="flex items-center">
            {notification.type === 'success' && <SuccessIcon />}
            {notification.type === 'error' && <TriangleWarningIcon />}
            <span className="ml-6 text-base text-text-secondary">{notification.text}</span>
          </div>
          <button
            type="button"
            className="cursor-pointer hover:text-text-secondary text-text-primary transition-all"
            onClick={() => removeNotificationById(notification.id as string)}
          >
            <XMarkMd fill="currentColor" />
          </button>
        </div>
      ))}
    </div>,
    document.querySelector('#notification-container') as HTMLElement
  );
};

export default NotificationContainer;
