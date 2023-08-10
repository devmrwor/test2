import { useTranslation } from 'next-i18next';

interface EmptyDataComponentProps {
  icon: React.ReactNode;
  heading: string;
  text?: string;
  additionalText?: string;
  textDark?: boolean;
}

export const EmptyDataComponent = ({
  icon,
  heading,
  text = '',
  additionalText = '',
  textDark = false,
}: EmptyDataComponentProps) => {
  const { t } = useTranslation();
  return (
    <div className="px-3.95 mt-10 text-text-secondary">
      <div className="w-29.25 h-29.25 bg-background mb-5.75 rounded-full mx-auto flex items-center justify-center">
        {icon}
      </div>
      <p className={`text-lg text-center mb-[13.6px] ${textDark ? 'text-text-primary' : 'text-toggle-background '}`}>
        {t(heading)}
      </p>
      <p className="px-2 text-lg text-center">{t(text)}</p>
      <p className="mt-6 px-2 text-lg text-center text-text-secondary">{t(additionalText)}</p>
    </div>
  );
};
