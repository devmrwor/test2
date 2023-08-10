import { FormControlLabelProps } from '@mui/material';
import { RadioButton } from '../RadioButton/RadioButton';
import { FormControlLabel as FormControlMui } from '@mui/material';

export const FormControlLabel = (props: Omit<FormControlLabelProps, 'control'>) => {
  return (
    <FormControlMui
      control={<RadioButton />}
      style={{
        color: 'black',
        margin: '0 0 -4px -9px',
      }}
      sx={{
        '& .MuiTypography-root': {
          fontSize: props.fontSize ? props.fontSize : '16px',
        },
      }}
      className="hover:bg-secondary focus:border-primary-800 border-transparent border-2 focus:bg-secondary active:bg-secondary pr-2.5 rounded-small"
      {...props}
    />
  );
};
