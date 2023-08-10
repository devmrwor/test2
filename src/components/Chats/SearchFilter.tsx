import { useTranslation } from 'next-i18next';
import { SvgIcon, TextField } from '@mui/material';
import { MagnifyingGlass, Sliders } from '@/components/Icons/Icons';
import { secondary } from '@/themes/colors';

export default function SearchFilter() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mt-3.75 mb-[16.5px]">
      <div className="grow bg-background rounded-md">
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('search')}
          InputProps={{
            startAdornment: <SvgIcon component={MagnifyingGlass} viewBox="0 0 24 24" />,
          }}
          sx={{
            '.MuiOutlinedInput-root': {
              height: '32px',
              backgroundColor: 'rgba(243, 243, 243, 1)',
            },
            '.MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },

            '.MuiInputBase-input': {
              marginLeft: '14px',
              height: '32px',
            },
          }}
        />
      </div>
      <button className="flex items-center text-[26px]">
        <div
          className={`before:content-[''] before:w-3 before:h-3 before:ml-4.5 before:bg-red-200 before:rounded-full mt-px`}
        >
          <Sliders fill={secondary.value} />
        </div>
        <div className="ml-2.25 leading-5 text-text-secondary text-base">{t('filter')}</div>
      </button>
    </div>
  );
}
