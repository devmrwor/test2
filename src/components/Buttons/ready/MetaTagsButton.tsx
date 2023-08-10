import { useTranslation } from 'next-i18next';
import { AddCircleIconOutline } from '../../Icons/Icons';
import { IconButton } from '../IconButton';
import { BaseButton } from '../BaseButton';
import classNames from 'classnames';

interface MetaTagsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isActive?: boolean;
  disabled?: boolean;
}

export const MetaTagsButton = ({ text, isActive = false, disabled = false, ...props }: MetaTagsButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={classNames(
        'button px-1.75 py-0.5 flex gap-2 items-center border rounded-small text-sm box-border',
        isActive
          ? 'border-primary-100 text-primary-100'
          : disabled
          ? 'text-text-disabled border-text-disabled cursor-not-allowed'
          : 'border-text-secondary bg-white hover:bg-background text-text-secondary focus:bg-white focus:border-primary-800 focus:border-2 '
      )}
      {...props}
    >
      {text}
    </button>
  );
};
