import { useTranslation } from 'next-i18next';
import { CrossIcon } from '@/components/Icons/Icons';
import { FilterProperty } from '../../../../common/types/order-filter';

interface FiltersListProps {
  filters: FilterProperty | null;
  deleteFilter: (key: string) => void;
}

export const FiltersList = ({ filters, deleteFilter }: FiltersListProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-nowrap overflow-x-auto space-x-2.75 no-scrollbar">
      {filters &&
        Object.entries(filters).map(
          ([key, value]) =>
            !!value && (
              <button
                key={key}
                onClick={() => deleteFilter(key)}
                className="flex items-center justify-between shrink-0 px-1.75 border border-text-secondary rounded-md"
              >
                <span className="text-text-secondary mr-1.5">
                  {t(key === 'lowest_price' ? 'up_to_price' : key === 'highest_price' ? 'from_price' : value, {
                    value: value,
                  })}
                </span>
                <CrossIcon />
              </button>
            )
        )}
    </div>
  );
};
