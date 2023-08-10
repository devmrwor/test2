import { useTranslation } from 'next-i18next';
import { AddCircleIconOutline, FilterIcon } from '../../Icons/Icons';
import { IconButton } from '../IconButton';
import { BaseButton } from '../BaseButton';

interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FilterButton = ({ ...props }: FilterButtonProps) => {
  const { t } = useTranslation();

  return (
    <BaseButton fill="outline" size="md" color="primary" Icon={FilterIcon} text={t('filter')} {...props}></BaseButton>
  );
};
