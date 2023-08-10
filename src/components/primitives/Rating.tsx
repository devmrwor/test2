import { FormControlsWrapper } from '../FormControlsWrapper/FormControlsWrapper';
import { MuiRating } from '@/components/RatingBlocks/MuiRating';
import { useTranslation } from 'next-i18next';

interface RatingProps {
  rating: number;
  reviews: number;
  classes?: string;
  iconSize?: string;
  slash?: boolean;
}

export const Rating = ({ rating, reviews, classes = '', iconSize = 'sm', slash = false }: RatingProps) => {
  const { t } = useTranslation();
  return (
    <FormControlsWrapper type="left" classes={`mb-2.25 items-center ${classes}`}>
      <MuiRating defaultValue={rating} readOnly iconSize={iconSize} />
      <div className={`flex items-center ${iconSize === 'lg' && 'pt-1'}`}>
        <p className="ml-0.5">{rating}</p>
        <div className="mx-1.5">{slash ? '/' : '-'}</div>
        <p>
          {reviews} {t('marks')}
        </p>
      </div>
    </FormControlsWrapper>
  );
};
