import { Languages } from '../../../common/enums/languages';
import { CircleCheck } from '../Icons/Icons';

export const LanguageBar = () => {
  return (
    <div className="flex items-center space-x-2.25">
      {Object.values(Languages).map((lang) => (
        <div
          key={lang}
          className="flex justify-center items-center h-8.75 w-15.5 text-xl text-text-secondary uppercase border border-darken-background rounded"
        >
          {lang}
          <span className="ml-1.25 text-grey-100">
            <CircleCheck fill="currentColor" size="sm" />
          </span>
        </div>
      ))}
    </div>
  );
};
