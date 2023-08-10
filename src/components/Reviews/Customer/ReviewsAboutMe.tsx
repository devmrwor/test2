import { EmptyDataComponent } from './EmptyDataComponent';
import { BigStarGroup, ChevronLeft } from '@/components/Icons/Icons';
import { useTranslation } from 'next-i18next';
import React, { Fragment } from 'react';
import ReviewCard from '@/pages/client/artur/executorReviews/components/ReviewsAboutMe/components/ReviewCard';
import { Pagination } from '@/components/Pagination/Pagination';
import Link from 'next/link';

export const ReviewsAboutMe = () => {
  const { t } = useTranslation();

  const data = Array(2).fill('');

  if (data.length === 0)
    return <EmptyDataComponent icon={<BigStarGroup />} heading="empty_list" text="reviews_about_me_customer" />;

  return (
    <Fragment>
      <div className="flex my-4 p-2.75 gap-2">
        <button
          className={`text-sm py-0.5 px-[8px] w-full rounded-md border bg-primary-100 text-white p-px border-primary-100`}
        >
          {t('executor_reviews.with_reaction', { reactionsQty: 2 })}
        </button>
        <button
          className={`text-sm py-0.5 px-[8px] w-full rounded-md border bg-background text-text-secondary border-text-secondary`}
        >
          {t('executor_reviews.with_no_reaction', { noReactionsQty: 2 })}
        </button>
      </div>
      <div className="pl-2.75 text-text-secondary">
        {t('executor_reviews.required_to_answer', { out_of: 5, total: 77 })}
      </div>
      <Link href="/client/artur/CustomerReview">
        <ReviewCard user="customer" reviews="about me" reply={true} />
      </Link>
      <Link href="/client/artur/CustomerReview">
        <ReviewCard user="customer" reviews="about me" reply={false} />
      </Link>
      <div className="w-full mt-6 mb-10.25 flex flex-col items-center text-text-secondary">
        <div className="flex w-full items-center justify-center mb-5.5">
          <button className="flex items-center mr-[23.26px] pl-[21.35px] pr-[33.5px] pt-[7.6px] pb-[8.44px] border border-text-secondary rounded">
            <ChevronLeft fill="#949494" />
            <span className="ml-[16.55px] text-lg">{t('backward')}</span>
          </button>
          <button className="flex items-center pr-[21.35px] pl-[33.5px] pt-[7.6px] pb-[8.44px] border border-text-secondary rounded">
            <span className="mr-[16.55px] text-lg">{t('forward')}</span>
            <div className="rotate-180">
              <ChevronLeft fill="#949494" />
            </div>
          </button>
        </div>
        <Pagination
          page={1}
          count={3}
          sx={{
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </div>
    </Fragment>
  );
};
