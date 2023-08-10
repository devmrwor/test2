import { useTranslation } from 'next-i18next';
import { ChangeEvent, useState } from 'react';
import { SortOrders } from '../../common/enums/sort-order';
import { DEFAULT_PAGE } from '../../common/constants/categoriesPagination';
import { useRouter } from 'next/router';

interface useTableHeadDataProps {
  columns: (string | undefined)[];
  setPage: (page: number) => void;
}

export const useTableHeadData = ({ columns, setPage }: useTableHeadDataProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { query } = router;

  const [sortField, setSortField] = useState<string>((query.sortField as string) || 'id');
  const [sortOrder, setSortOrder] = useState<SortOrders>((query.sortOrder as SortOrders) || SortOrders.ASC);

  const sortOrderClickHandler = (field: string) => {
    let order = SortOrders.ASC;

    if (sortField === field) {
      order = sortOrder === SortOrders.ASC ? SortOrders.DESC : SortOrders.ASC;
    }

    setSortField(field);
    setSortOrder(order);

    setPage(DEFAULT_PAGE);
    router.replace({
      pathname: router.pathname,
      query: { ...query, sortField: field, sortOrder: order, page: DEFAULT_PAGE },
    });
  };

  const mappedColumns = columns
    .filter((item) => item !== undefined)
    .map((key) => ({
      label: t(key as string),
      labelTip: t(key + '_tip') === key + '_tip' ? '' : t(key + '_tip'),
      isActive: key === sortField,
      onClick: () => sortOrderClickHandler(key as string),
    }));

  const tableHeadData = [...mappedColumns];

  return { tableHeadData, sortOrder, sortField };
};
