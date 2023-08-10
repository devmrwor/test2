import { Radio, RadioProps } from '@mui/material';
import classNames from 'classnames';

const BpCheckedIcon = ({ disabled }: { disabled?: string }) => {
  return (
    <div
      className={classNames(
        'relative rounded-full w-4 h-4 border-2',
        disabled ? 'border-darken-background' : 'border-primary-100'
      )}
    >
      <span
        className={classNames(
          'absolute top-0.5 left-0.5 w-2 h-2 rounded-full',
          disabled ? 'bg-darken-background' : 'bg-primary-100'
        )}
      ></span>
    </div>
  );
};
const BpIcon = ({ disabled }: { disabled?: string }) => {
  return (
    <span
      className={classNames(
        'rounded-full w-4 h-4 border-2',
        disabled ? 'border-darken-background' : 'border-primary-100'
      )}
    ></span>
  );
};

export function RadioButton({ disabled, ...props }: RadioProps) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon disabled={disabled} />}
      icon={<BpIcon disabled={disabled} />}
      className="focus:border-2 focus:border-primary-900"
      {...props}
    />
  );
}
