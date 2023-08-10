import { Rating as StyledRating, RatingProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { light, rating } from '@/themes/colors';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

interface Props extends RatingProps {
  iconSize?: SizeProp;
}

export const MuiRating = (props: Props) => {
  const { size, emptyIcon, icon, className, iconSize, ...rest } = props;
  return (
    <StyledRating
      size={size ?? 'small'}
      emptyIcon={emptyIcon ?? <FontAwesomeIcon icon={faStar} color={light.value} size={iconSize ?? 'sm'} />}
      icon={icon ?? <FontAwesomeIcon icon={faStar} color={rating.value} size={iconSize ?? 'sm'} />}
      className={className ?? 'gap-1'}
      {...rest}
    />
  );
};
