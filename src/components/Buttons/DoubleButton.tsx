import { CustomerTypes } from '../../../common/enums/customer-type';
import { UserIconBottom, BuildingUser } from '@/components/Icons/Icons';
import { useTranslation } from 'next-i18next';
import _filter from '@/styles/client/filter.module.css';

interface DoubleButtonProps {
  value: string;
  setValue: (value: string) => void;
  classes?: string;
  radius?: string;
}

export const DoubleButton = ({ value, setValue, classes, radius = 'rounded' }: DoubleButtonProps) => {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center space-x-px my-1 mb-7 ${classes}`}>
      {Object.values(CustomerTypes)
        .slice(0, 2)
        .map((type) => (
          <button
            key={type}
            onClick={(e) => {
              e.preventDefault();
              setValue(type);
            }}
            className={`flex justify-center items-center pt-[5px] pb-[3px] grow p-px ${
              value === type ? 'bg-primary-200 text-black ' : 'bg-background text-text-secondary '
            } ${_filter['toggle__btn']}`}
          >
            {type === CustomerTypes.INDIVIDUAL && <UserIconBottom fill="currentColor" />}
            {type === CustomerTypes.COMPANY && <BuildingUser fill="currentColor" />}
            <span className="ml-2">{type === CustomerTypes.INDIVIDUAL ? t('individual') : t('company')}</span>
          </button>
        ))}
    </div>
  );
};
