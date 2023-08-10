import { FormControlLabelProps } from '@mui/material';
import { CustomCheckbox } from '@/components/Checkbox/Checkbox';
import { Control, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import { useRef } from 'react';

interface ControlledCheckboxLabelProps extends Omit<FormControlLabelProps, 'control' | 'classes' | 'label'> {
  text: string;
  value?: boolean;
  onChange?: (e: any) => void;
  classes?: string;
}

export const CheckboxLabel = ({ onChange, value, classes = '-left-2.5', text }: ControlledCheckboxLabelProps) => {
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
      <CustomCheckbox id={id} checked={value} onChange={onChange} />
      <p className="text-text-primary mr-2">{text}</p>
    </label>
  );
};
