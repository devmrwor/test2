import { useTranslation } from 'next-i18next';

interface ButtonProps {
  value: string;
  text: string;
  icon?: React.ReactNode;
}

interface DoubleRoundedBtnProps {
  firstVal: ButtonProps;
  secondVal: ButtonProps;
  selectedValue: string;
  onChange: (value: string) => void;
  classes?: string;
}

export const DoubleRoundedBtn = ({
  firstVal,
  secondVal,
  selectedValue,
  onChange,
  classes = '',
}: DoubleRoundedBtnProps) => {
  const { t } = useTranslation();

  return (
    <div className={`flex justify-center gap-0.5 items-center w-full ${classes}`}>
      <button
        onClick={() => onChange(firstVal.value)}
        className={`flex justify-center items-center grow rounded-l-full ${
          selectedValue === firstVal.value ? 'bg-primary-50 text-text-primary' : 'bg-background text-text-secondary'
        }`}
      >
        {firstVal.icon && <div className="mr-2">{firstVal.icon}</div>}
        <div className=" pt-1.5 pb-1  ">{t(firstVal.text)}</div>
      </button>
      <button
        onClick={() => onChange(secondVal.value)}
        className={`flex justify-center items-center grow rounded-r-full ${
          selectedValue === secondVal.value ? 'bg-primary-50 text-text-primary' : 'bg-background text-text-secondary'
        }`}
      >
        {secondVal.icon && <div className="mr-2">{secondVal.icon}</div>}
        <div className="pt-1.5 pb-1 ">{t(secondVal.text)}</div>
      </button>
    </div>
  );
};
