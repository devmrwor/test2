import { ChevronLeftSolid } from '@/components/Icons/Icons';
import { useTranslation } from 'next-i18next';
import { ReactNode } from 'react';

interface BackHeaderProps {
  heading: string;
  onClick: () => void;
  buttonContent?: string | JSX.Element;
  buttonFunc?: () => void;
  classes?: string;
  headingColor?: string;
  children?: ReactNode | ReactNode[];
}

export const BackHeader = ({
  heading,
  onClick,
  buttonContent,
  buttonFunc,
  classes,
  headingColor = '',
  children,
}: BackHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className={`relative flex justify-between text-[28px] ${classes} `}>
      <button onClick={onClick} className="flex items-center">
        <ChevronLeftSolid />
        <div className="text-base leading-7 ml-0.5 text-primary-100">{t('backward')}</div>
      </button>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base whitespace-pre leading-7 ${
          headingColor || 'text-text-secondary'
        }`}
      >
        {t(heading)}
      </div>
      <div className="flex gap-4">
        {children}
        <button className="text-base leading-7 text-primary-100" onClick={buttonFunc}>
          {buttonContent}
        </button>
      </div>
    </div>
  );
};
