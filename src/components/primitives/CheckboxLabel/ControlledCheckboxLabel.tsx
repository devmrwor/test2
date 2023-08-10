import { FormControlLabelProps } from '@mui/material';
import { CustomCheckbox } from '@/components/Checkbox/Checkbox';
import { Control, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import { useRef } from 'react';

interface ControlledCheckboxLabelProps extends Omit<FormControlLabelProps, 'control' | 'classes' | 'label'> {
  control: Control<any>;
  text: string;
  name: string;
  classes?: string;
}

export const ControlledCheckboxLabel = ({
  control,
  name,
  classes = '-left-2.5',
  defaultValue,
  text,
}: ControlledCheckboxLabelProps) => {
  const idRef = useRef(uuidv4());
  const id = idRef.current;

  return (
    <label
      htmlFor={id}
      className={classNames(
        classes,
        'hover:bg-primary-200 flex items-center gap-1 cursor-pointer rounded-small focus:border-primary-800 focus:border-2 relative -left-2.5'
      )}
    >
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue || false}
        render={({ field }) => (
          <CustomCheckbox id={id} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
        )}
      />
      <p className="text-text-primary mr-2">{text}</p>
    </label>
  );
};
