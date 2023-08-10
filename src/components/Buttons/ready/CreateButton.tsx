import { useTranslation } from 'next-i18next';
import { AddCircleIconOutline } from '../../Icons/Icons';
import { BaseButton } from '../BaseButton';
import Link from 'next/link';

interface CreateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  onClick?: () => void;
}

export const CreateButton = ({ onClick, href, ...props }: CreateButtonProps) => {
  const { t } = useTranslation();

  return (
    <>
      {onClick && (
        <BaseButton
          fill="outline"
          size="md"
          type="outline"
          color="primary"
          Icon={AddCircleIconOutline}
          text={t('create')}
          onClick={onClick}
          {...props}
        ></BaseButton>
      )}
      {href && (
        <Link href={href}>
          <BaseButton
            fill="outline"
            size="md"
            type="outline"
            color="primary"
            Icon={AddCircleIconOutline}
            text={t('create')}
            {...props}
          ></BaseButton>
        </Link>
      )}
    </>
  );
};
