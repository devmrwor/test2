import { WarningIconLg } from '@/components/Icons/Icons';

interface LabelProps {
  caption?: string;
  text: string;
  isRequired?: boolean;
  withWarning?: boolean;
  captionLowerCase?: boolean;
  classes?: string;
}

export const LabelDoubleLine = ({
  caption,
  text,
  isRequired = false,
  withWarning = false,
  captionLowerCase = true,
  classes = '',
}: LabelProps) => {
  return (
    <div className={classes}>
      <p className="text-text-primary text-lg">
        {isRequired && <span className="mr-1 text-red-100">*</span>}
        {withWarning ? (
          <span className="items-center flex gap-2">
            {text}
            {<WarningIconLg />}
          </span>
        ) : (
          text
        )}
      </p>
      {caption && (
        <p className={`leading-3 text-text-secondary text-base ${captionLowerCase && 'lowercase'}`}>{caption}</p>
      )}
    </div>
  );
};
