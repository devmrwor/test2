import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

interface DateDividerProps {
  date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => {
  const { i18n } = useTranslation();
  const formattedDate = dayjs(date).locale(i18n.language).format('DD MMMM YYYY');

  return <div className="text-text-secondary text-center capitalize">{formattedDate}</div>;
};
