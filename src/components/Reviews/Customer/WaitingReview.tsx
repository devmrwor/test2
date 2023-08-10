import { StarInSquare, ChevronLeft } from '@/components/Icons/Icons';
import { EmptyDataComponent } from './EmptyDataComponent';
import { useTranslation } from 'next-i18next';
import { ReviewCard } from './ReviewCard';
import { DEFAULT_PAGE, REVIEWS_LIMIT } from '../../../../common/constants/categoriesPagination';
import React, { useState } from 'react';
import { Pagination } from '@/components/Pagination/Pagination';
import Link from 'next/link';

// const data = true;

const reviews = [
  {
    executor: 'Вячеслав Кондратьев',
    service_name: 'Woman haircut',
    currency: '$',
    price: 20,
    address: 'Praha 4, Lhotecká 2109',
    date_of_service: '15.04.2023',
  },
  {
    executor: 'Вячеслав Кондратьев',
    service_name: 'Woman haircut',
    currency: '$',
    price: 20,
    address: 'Praha 4, Lhotecká 2109',
    date_of_service: '15.04.2023',
  },
  {
    executor: 'Test test',
    service_name: 'Man haircut',
    currency: '$',
    price: 20,
    address: 'Praha 4, Lhotecká 2109',
    date_of_service: '15.04.2023',
  },
  {
    executor: 'Test test',
    service_name: 'Man haircut',
    currency: '$',
    price: 20,
    address: 'Praha 4, Lhotecká 2109',
    date_of_service: '15.04.2023',
  },
  {
    executor: 'Test test',
    service_name: 'Man haircut',
    currency: '$',
    price: 20,
    address: 'Praha 4, Lhotecká 2109',
    date_of_service: '15.04.2023',
  },
  {
    executor: 'Test test',
    service_name: 'Man haircut',
    currency: '$',
    price: 20,
    address: 'Praha 4, Lhotecká 2109',
    date_of_service: '15.04.2023',
  },
];

export const WaitingReview = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [openCard, setOpenCard] = useState<boolean>(false);

  const startIndex = (page - 1) * REVIEWS_LIMIT;
  const endIndex = startIndex + REVIEWS_LIMIT;
  // const displayedData = [];
  const displayedData = reviews.slice(startIndex, endIndex);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
    // router.push({
    // 	pathname: router.pathname,
    // 	query: { ...query, limit: REVIEWS_LIMIT, page: newPage },
    // });
  };

  const handleOpenCard = () => {
    setOpenCard(!openCard);
  };

  const handleForward = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleBack = () => {
    setPage((prevPage) => prevPage - 1);
  };

  return displayedData.length > 0 ? (
    <div className="mt-4.25 h-[calc(100%-242px)] flex flex-col justify-between">
      <div>
        <p className="text-text-secondary mb-[6.86px]">{t('you_ordered_services')}</p>
        {displayedData.map((review, i) => (
          // <div onClick={handleOpenCard}>
          <Link href="/client/artur/waitingForRating" key={i}>
            <ReviewCard review={review} />
          </Link>
          // </div>
        ))}
      </div>
      <div className="w-full mb-10.25 flex flex-col items-center text-text-secondary">
        <div className="flex w-full items-center justify-center mb-5.5">
          <button
            className="flex items-center mr-[23.26px] pl-[21.35px] pr-[33.5px] pt-[7.6px] pb-[8.44px] border border-text-secondary rounded"
            onClick={handleBack}
          >
            <ChevronLeft fill="#949494" />
            <span className="ml-[16.55px] text-lg">{t('backward')}</span>
          </button>
          <button
            className="flex items-center pr-[21.35px] pl-[33.5px] pt-[7.6px] pb-[8.44px] border border-text-secondary rounded"
            onClick={handleForward}
          >
            <span className="mr-[16.55px] text-lg">{t('forward')}</span>
            <div className="rotate-180">
              <ChevronLeft fill="#949494" />
            </div>
          </button>
        </div>
        <Pagination
          page={page}
          count={Math.ceil(reviews.length / REVIEWS_LIMIT)}
          onChange={(event, page) => setPage(page)}
          sx={{
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </div>
    </div>
  ) : (
    <EmptyDataComponent icon={<StarInSquare />} heading="empty_list" text="empty_reviews_marks" />
  );
};
