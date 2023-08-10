import { ChevronLeftSolid, FolderViewIcon, GalleryViewIcon } from '@/components/Icons/Icons';
import { useTranslation } from 'next-i18next';

interface BackHeaderProps {
  heading: string;
  onClick: () => void;
  classes?: string;
  headingColor?: string;
  listView: boolean;
  listViewFunc: () => void;
  folderViewFunc: () => void;
}

export const BackHeaderViews = ({
  heading,
  onClick,
  classes,
  headingColor = '',
  listView,
  listViewFunc,
  folderViewFunc,
}: BackHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className={`flex justify-between text-[28px] relative ${classes}`}>
      <button onClick={onClick} className="flex items-center">
        <ChevronLeftSolid />
        <div className="text-base leading-7 ml-0.5 text-primary-100">{t('backward')}</div>
      </button>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base leading-7 ${
          headingColor || 'text-text-secondary'
        }`}
      >
        {t(heading)}
      </div>
      <div className="flex items-center space-x-2.75">
        <button onClick={listViewFunc} className={`${listView ? 'text-primary-100' : 'text-text-secondary'} `}>
          <FolderViewIcon fill="currentColor" />
        </button>
        <button onClick={folderViewFunc} className={`${listView ? 'text-text-secondary' : 'text-primary-100'}`}>
          <GalleryViewIcon fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
