import withLayout from '@/hocs/withLayout';
import withRole from '@/hocs/withRole';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { useRouter } from 'next/router';
import { ApiRoutes, Routes, UserRoutes, UserSubRoutes } from '../../../common/enums/api-routes';
import { Roles } from '../../../common/enums/roles';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useLayout } from '@/contexts/layoutContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ProfileForm from '@/components/ProfileForm';
import { IProfile, IProfileForm } from '../../../common/types/profile';
import { toast } from 'react-toastify';
import { PROFILE_IMAGES } from '../../../common/constants/file-fields';
import withUsersLayout from '@/hocs/withUsersLayout';
import { TabsGroup } from '@/components/TabsGroup/TabsGroup';
import { ProfileLanguages } from '../../../common/enums/profile-languages';
import { LanguagesSwitch } from '@/components/LanguageSwitch/LanguageSwitch';

const CreateProfile = () => {
  const router = useRouter();
  const query = router.query;
  console.log(query);

  const { t } = useTranslation();
  const { setBreadcrumbs, addNotification } = useLayout();
  const { userId } = router.query;

  const createProfile = async (data: IProfileForm) => {
    try {
      const body = JSON.stringify({
        ...data,
        user_id: userId || 1,
        profile_language: (query.language as string) || ProfileLanguages.UKRAINIAN,
      });
      const response = await fetch(uniteApiRoutes([ApiRoutes.PROFILES]), {
        method: 'POST',
        body,
      });
      if (!response.ok) {
        console.log(response);
        throw new Error('Error creating profile');
      }
      const category = await response.json();
      addNotification({ type: 'success', text: t('profile_created_successfully') });
      router.push(uniteRoutes([Routes.USERS, UserRoutes.EXECUTORS]));
    } catch (error) {
      addNotification({ type: 'error', text: t('error_creating_profile') });
      console.error('Error creating profile:', error);
    }
  };

  useEffect(() => {
    const executorOrCustomer =
      query.userRole === UserRoutes.EXECUTORS
        ? { route: uniteRoutes([Routes.USERS, UserRoutes.EXECUTORS]), name: t('executors') }
        : { route: uniteRoutes([Routes.USERS, UserRoutes.CUSTOMERS]), name: t('customers') };
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: uniteRoutes([Routes.USERS]), name: t('users') },
      executorOrCustomer,
      { route: uniteRoutes([Routes.USERS, UserRoutes.CREATE]), name: t('new') },
    ]);
  }, []);

  const changeProfileLang = (language: ProfileLanguages) => {
    router.push({
      pathname: router.pathname,
      query: { ...query, language },
    });
  };

  return (
    <div className="container mx-auto p-4 pb-4">
      <div className="max-w-form mb-6 mt-4">
        <LanguagesSwitch value={query.language} onChange={changeProfileLang} />
      </div>
      <ProfileForm onSubmit={createProfile} />
    </div>
  );
};

export default withRole(withLayout(withUsersLayout(CreateProfile, true)), [Roles.ADMIN]);

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
