import { uniteRoutes } from '@/utils/uniteRoute';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthRoutes, ClientRoutes, Routes } from '../../../common/enums/api-routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const EmailNotVerifiedPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(uniteRoutes([Routes.AUTH, AuthRoutes.REGISTER]));
  }, [router]);

  return (
    <div className="container mx-auto px-4 pt-8 text-center">
      <h1 className="text-text-primary text-4xl font-bold mb-4">{t('email_verification_error')}</h1>
      <p className="text-text-primary text-xl mb-4">{t('email_error_caption')}</p>
      <Link href={uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.LOGIN])}>
        <button type="button" className="bg-primary-100 text-white font-bold px-6 py-2 rounded">
          {t('go_to_register')}
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

export default EmailNotVerifiedPage;
