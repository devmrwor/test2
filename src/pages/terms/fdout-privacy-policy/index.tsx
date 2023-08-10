import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PolicyContent from '@/pages/terms/vvvv-privacy-policy/components/Policy';

export default function Policy() {
  return (
    <div className="p-2.75">
      <PolicyContent />
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['policy'])),
    },
  };
}
