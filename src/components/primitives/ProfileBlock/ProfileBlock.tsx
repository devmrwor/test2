import { useCallback } from 'react';
import { ChevronLeftSolid } from '../../Icons/Icons';
import { Toggle } from '../Toggle/toggle';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

interface ProfileBlockProps {
  heading: string;
  headingCaption?: string;
  headingValue?: string;
  count?: number;
  caption?: string;
  text?: string;
  toggle?: boolean;
  divider?: boolean;
  dividerStyle?: string;
  show?: boolean;
  setShow?: (value: boolean) => void;
  onClick?: () => void;
}

export const ProfileBlock = ({
  heading,
  headingCaption = '',
  headingValue = '',
  count,
  caption,
  text = '',
  toggle = true,
  divider = true,
  dividerStyle,
  show = false,
  setShow,
  onClick,
}: ProfileBlockProps) => {
  const { t } = useTranslation();

  const handleToggleChange = () => {
    setShow(!show);
  };

  return (
    <>
      <div onClick={onClick} className="flex justify-between items-center">
        <div>
          <h3 className="text-lg text-text-primary">
            {t(heading)}
            {headingCaption && <span className="text-text-secondary text-base"> ({t(headingCaption)})</span>}
            {headingValue && <span> &quot;{t(headingValue)}&quot;</span>}
          </h3>
          <p className="text-text-secondary">
            {count} {caption && t(caption)}
          </p>
        </div>

        <div onClick={onClick} className="rotate-180 text-xl">
          <ChevronLeftSolid fill="#949494" />
        </div>
      </div>
      {toggle && (
        <div className="flex justify-between items-center mt-2.5">
          <p className="leading-5 text-text-secondary">{t(text)}</p>
          <Toggle value={show} onChange={handleToggleChange} />
        </div>
      )}
      {divider && <div className={`border-background-decorative border-b ${dividerStyle}`}></div>}
    </>
  );
};
