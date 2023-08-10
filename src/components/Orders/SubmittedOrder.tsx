import { useTranslation } from 'next-i18next';
import { SuccessIcon } from '../Icons/Icons';
import { useRouter } from 'next/router';
import { ClientRoutes } from '../../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';

export const SubmittedOrder = ({ order }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { name } = order;

  const handleClose = () => {
    router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.ORDERS]));
  };
  return (
    <div className="pt-2.75 px-2.75">
      <button onClick={handleClose} className="block ml-auto text-primary-100">
        {t('close')}
      </button>
      <div className="flex flex-col justify-center items-center mt-6.75 text-lg leading-6">
        <SuccessIcon width="92" height="92" />
        <p className="mt-8.5">{t('your_order')}</p>
        <p className="text-primary-100">{name}</p>
        <p>{t('was_sent_to publish')}</p>
        <p className="text-base mt-4.5 max-w-messengers text-center">{t('publishing_text')}</p>
        <button
          onClick={handleClose}
          className="mt-5.75 h-8.75 w-32.5 text-text-secondary border border-darken-background rounded"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
};
