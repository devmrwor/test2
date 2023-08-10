import { uniteRoutes } from '@/utils/uniteRoute';
import { CircularProgress } from '../primitives/CircularProgress/CircularProgress';
import Link from 'next/link';
import { StarIcon } from '../Icons/Icons';
import { ClientRoutes } from '../../../common/enums/api-routes';
import { useTranslation } from 'next-i18next';
import { IProfile } from '../../../common/types/profile';
import { getFilledProfileValue } from '@/utils/getProfilePercent';

interface ServicesItemProps {
  item: IProfile;
}

export const ServicesItem = ({ item }: ServicesItemProps) => {
  const { t } = useTranslation();
  return (
    <div key={item.id} className="items-center justify-between flex">
      <div className="flex gap-3 items-center">
        <CircularProgress value={+getFilledProfileValue(item)} />
        <Link href={uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.EXECUTOR, item.id])} className="text-primary-100">
          {item.category?.name ?? t('not_provided')}
        </Link>
      </div>
      <div className="flex gap-3 items-center">
        <div className="w-5">
          <StarIcon fill="#f5ca02"></StarIcon>
        </div>
        <div className="text-text-primary text-base flex gap-1 grow-0">
          <span>1 </span>
          <span>/</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
};
