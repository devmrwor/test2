import withLayout from '@/hocs/withLayout';
import withRole from '@/hocs/withRole';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { useRouter } from 'next/router';
import { ApiRoutes, Routes, CategoryRoutes } from '../../../common/enums/api-routes';
import { Roles } from '../../../common/enums/roles';
import { ICategoryForm } from '../../../common/types/category';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useLayout } from '@/contexts/layoutContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CategoryForm from '@/components/CategoryForm';
import { toast } from 'react-toastify';
import { CATEGORY_IMAGES } from '../../../common/constants/file-fields';

const CreateCategory = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { setBreadcrumbs, addNotification } = useLayout();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const createCategory = async (data: ICategoryForm) => {
    try {
      setIsFormSubmitting(true);
      console.log(data);
      console.log(JSON.stringify(data));

      const response = await fetch(uniteApiRoutes([ApiRoutes.CATEGORIES]), {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error creating category');
      }
      const category = await response.json();
      addNotification({
        type: 'success',
        text: t(`Category ${category.name} created successfully`),
      });
      router.push(uniteRoutes([Routes.CATEGORIES]));
    } catch (error) {
      addNotification({
        type: 'error',
        text: 'Error creating category',
      });
      console.error('Error creating category:', error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: uniteRoutes([Routes.CATEGORIES]), name: t('categories') },
      { route: uniteRoutes([Routes.CATEGORIES, CategoryRoutes.CREATE]), name: t('new') },
    ]);
  }, []);

  return (
    <div className="container mx-auto p-4 pb-4">
      {/* <h1 className="text-4xl font-bold mb-6">Create Category</h1> */}
      <CategoryForm isLoading={isFormSubmitting} onSubmit={createCategory} />
    </div>
  );
};

export default withRole(withLayout(CreateCategory), [Roles.ADMIN]);

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
