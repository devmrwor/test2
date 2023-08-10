import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Fragment } from 'preact';

export const Top = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-6 px-3.25 py-6 text-white bg-grey-100">
      <section className="flex flex-col ">
        <h5 className="italic">{t('footer.for_client')}</h5>
        <Link href="/" className="underline">
          {t('footer.how_to_find_executor')}
        </Link>
      </section>

      <section className="flex flex-col ">
        <h5 className="italic">{t('footer.for_executor')}</h5>
        <Link href="/" className="underline">
          {t('footer.how_to_increase_rating')}
        </Link>
      </section>

      <section className="flex flex-col ">
        <h5 className="italic">{t('footer.projects')}</h5>
        <div>
          <Link href="/" className="underline">
            {t('footer.ads')}
          </Link>{' '}
          ({t('footer.sell_buy')})
        </div>
        <div>
          <Link href="/" className="underline">
            {t('footer.Job')}
          </Link>{' '}
          |{' '}
          <Link href="/" className="underline">
            {t('footer.Vacancies')}
          </Link>{' '}
          ({t('footer.employment')})
        </div>

        <div>
          <Link href="/" className="underline">
            {t('footer.order')}
          </Link>{' '}
          |{' '}
          <Link href="/" className="underline">
            {t('footer.executor')}
          </Link>{' '}
          ({t('footer.you_are_here-now')})
        </div>
      </section>
    </div>
  );
};
