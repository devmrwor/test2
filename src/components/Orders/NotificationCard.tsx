import { WarningIcon } from '../Icons/Icons';
import { useTranslation } from 'next-i18next';

export const NotificationCard = () => {
  const { t } = useTranslation();
  return (
    <div className="pt-2.75 px-5.75`">
      <button className="block ml-auto text-primary-100">{t('close')}</button>
      <WarningIcon height="92" width="92" />
    </div>
  );
};
