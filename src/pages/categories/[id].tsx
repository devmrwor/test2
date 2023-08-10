import withLayout from '@/hocs/withLayout';
import withRole from '@/hocs/withRole';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ApiRoutes, Routes } from '../../../common/enums/api-routes';
import { Roles } from '../../../common/enums/roles';
import { ICategory, ICategoryForm } from '../../../common/types/category';
import { useQuery } from 'react-query';
import { getCategory } from '@/services/categories';
import { useLayout } from '@/contexts/layoutContext';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CategoryForm from '@/components/CategoryForm';

const UpdateCategory = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const { setBreadcrumbs, addNotification } = useLayout();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const { data: category, isLoading: categoryLoading } = useQuery<ICategory>(
    'category',
    () => getCategory(id as string),
    { refetchOnWindowFocus: false }
  );

  const isLoading = categoryLoading || isFormSubmitting;

  useEffect(() => {
    if (!category) return;
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t('home') },
      { route: uniteRoutes([Routes.CATEGORIES]), name: t('categories') },
      { route: uniteRoutes([Routes.CATEGORIES, id as string]), name: category.name },
    ]);
  }, [category]);

  const updateCategory = async (data: ICategoryForm) => {
    if (isLoading) return;
    setIsFormSubmitting(true);
    try {
      const formData = new FormData();

      for (const key in data) {
        if (Array.isArray(data[key]) && key === 'translations') {
          formData.append(key, JSON.stringify(data[key]));
          continue;
        }
        if (Array.isArray(data[key]) && data[key].length === 1) {
          formData.append(key + '[]', data[key]);
          continue;
        }
        if (Array.isArray(data[key]) && data[key].length > 0) {
          data[key].forEach((element) => {
            formData.append(key, element);
          });
          continue;
        }
        formData.append(key, data[key]);
      }
      const response = await fetch(uniteApiRoutes([ApiRoutes.CATEGORIES, id as string]), {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error updating category');
      }
      router.push(uniteRoutes([Routes.CATEGORIES]));
      addNotification({
        type: 'success',
        text: t('category_updated'),
      });
    } catch (error) {
      console.error('Error updating category:', error);
      addNotification({
        type: 'error',
        text: t('category_update_error'),
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pb-4">
      {isLoading && <div>{t('loading')}</div>}
      <CategoryForm id={id as string} initialValues={category} isLoading={isLoading} onSubmit={updateCategory} />
    </div>
  );
};

export default withRole(withLayout(UpdateCategory), [Roles.ADMIN]);

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
export async function getStaticPaths() {
  const paths: number[] = [];

  return {
    paths,
    fallback: true,
  };
}
