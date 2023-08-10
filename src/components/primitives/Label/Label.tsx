import { WarningIconLg } from '@/components/Icons/Icons';

interface LabelProps {
  caption?: string;
  text: string;
  isRequired?: boolean;
  withWarning?: boolean;
  captionLowerCase?: boolean;
  classes?: string;
}

export const Label = ({
  caption,
  text,
  isRequired = false,
  withWarning = false,
  captionLowerCase = true,
  classes = '',
}: LabelProps) => {
  return (
    <p className={`text-text-primary text-lg ${classes}`}>
      {isRequired && <span className="mr-1 text-red-100">*</span>}
      {withWarning ? (
        <span className="items-center flex gap-2">
          {text}
          {<WarningIconLg />}
        </span>
      ) : (
        text
      )}
      {caption && (
        <span className={`ml-1 text-text-secondary text-sm relative -top-px ${captionLowerCase && 'lowercase'}`}>
          ({caption})
        </span>
      )}
    </p>
  );
};
