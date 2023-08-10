import { Label } from './Label/Label';
import { CircleCheck } from '../Icons/Icons';
import { useTranslation } from 'next-i18next';

interface IsRequiredInputProps {
  text: string;
  caption?: string;
  required?: boolean;
  filled?: boolean;
  classes?: string;
}

export const IsRequiredInput = ({
  text,
  caption = '',
  required = false,
  filled = false,
  classes = '',
}: IsRequiredInputProps) => {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center space-x-2 ${classes}`}>
      <Label text={t(text)} caption={t(caption)} isRequired={required} />
      <CircleCheck fill={filled ? '#55bc7d' : '#f3f3f3'} size="sm" />
    </div>
  );
};
