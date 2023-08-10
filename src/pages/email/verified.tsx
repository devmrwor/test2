import { uniteRoutes } from '@/utils/uniteRoute';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthRoutes, ClientRoutes, Routes } from '../../../common/enums/api-routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { CircleCheckBig } from '@/components/Icons/Icons';
import Link from 'next/link';

const EmailVerifiedPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    router.prefetch(uniteRoutes([Routes.AUTH, AuthRoutes.LOGIN]));
  }, [router]);

  const isClient = query.client === 'true';

  if (isClient) {
    return (
      <div className="flex flex-col items-center">
        <div className="mt-[40.3px] mb-[22.7px]">{<CircleCheckBig />}</div>
        <h2 className="text-xl font-bold">{t('confirmation')}</h2>
        <p className="text-text-secondary mt-4.5 mb-[91.8px]">{t('successful_email_confirmation')}</p>
        <Link href={uniteRoutes([ClientRoutes.CLIENT, AuthRoutes.LOGIN])}>
          <button
            type="button"
            className="text-text-secondary border border-toggle-background pt-[6.5px] pb-[5.5px] pl-[33.5px] pr-[32.5px] rounded"
          >
            {t('close')}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-8 text-center">
      <h1 className="text-text-primary text-4xl font-bold mb-4">{t('email_verified')}</h1>
      <p className="text-text-primary text-xl mb-4">{t('email_verified_caption')} </p>
      <Link href={uniteRoutes([Routes.AUTH, AuthRoutes.LOGIN])}>
        <button type="button" className="bg-primary-100 text-white font-bold px-6 py-2 rounded">
          {t('go_to_login')}
        </button>
      </Link>
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default EmailVerifiedPage;
