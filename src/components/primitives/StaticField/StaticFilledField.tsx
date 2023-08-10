import { Label } from '../Label/Label';
import { TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';

interface StaticFilledFieldProps {
  container: string;
  text: string;
  caption: string;
  value: number | string;
  disabled: boolean;
}

export const StaticFilledField = ({ container, text, caption, value, disabled }: StaticFilledFieldProps) => {
  const { t } = useTranslation();
  return (
    <div className={`text-text-secondary ${container}`}>
      <Label text={t(text)} caption={t(caption)} />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={value}
        disabled={disabled}
        sx={{
          '& .MuiInputBase-input': {
            paddingTop: '6px',
            paddingBottom: '6px',
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(243, 243, 243, 1)',
            color: '#949494',
          },
        }}
      />
    </div>
  );
};
