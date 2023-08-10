import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CheckEmailPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 pt-8 text-center">
      <h1 className="text-text-primary text-4xl font-bold mb-4">{t('email_verification')}</h1>
      <p className="text-text-primary text-xl mb-4">{t('check_email_caption')}</p>
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

export default CheckEmailPage;
