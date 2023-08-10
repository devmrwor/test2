import { Label } from '../primitives/Label/Label';
import { useTranslation } from 'next-i18next';
import { TextField, SvgIcon } from '@mui/material';
import { LocationDotBig } from '../Icons/Icons';
import { IsRequiredInput } from '@/components/primitives/IsRequiredInput';

interface AddressProps {
  classes?: string;
  value: string;
  onChange: (value: string) => void;
  filled?: boolean;
}

export const Address = ({ classes, value, onChange, filled = false }: AddressProps) => {
  const { t } = useTranslation();
  return (
    <div className={classes}>
      {/*<Label text={t('address')} />*/}

      <IsRequiredInput text="address" filled={value !== ''} />
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder={t('city_placeholder')}
        value={value}
        InputProps={{
          startAdornment: <LocationDotBig fill="#b0b0b0" />,
        }}
        sx={{
          '.MuiInputBase-input': {
            marginLeft: '14px',
            paddingTop: '6px',
            paddingBottom: '6px',
          },
        }}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};
