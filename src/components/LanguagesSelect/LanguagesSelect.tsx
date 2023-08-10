import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { CircleCheck, DropdownIcon } from '../Icons/Icons';
import { languagesData } from '../../../common/constants/languages';
import { Label } from '@/components/primitives/Label/Label';
import { Secondary } from '@/components/primitives/Text/Text';
import { Language } from '../../../common/types/language';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';

interface LanguagesSelectProps {
  heading?: boolean;
  value: string | Language | undefined;
  onChange: (event: SelectChangeEvent<string | Language | undefined>) => void;
  placeholder: string;
}

export const LanguagesUserSelect = ({ heading = true, value, onChange, placeholder }: LanguagesSelectProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {heading && (
        <div className="flex items-center gap-1">
          <span className="text-red-100">*</span>
          <Label text={t('language')} />
          <CircleCheck fill={value ? '#55bc7d' : '#f3f3f3'} size="sm" />
        </div>
      )}

      <Select
        fullWidth
        displayEmpty
        IconComponent={() => (
          <div className="mr-5 -mt-2">
            <FontAwesomeIcon icon={faSortDown} color="#949494" />
          </div>
        )}
        value={value}
        onChange={onChange}
        renderValue={(selected) => {
          if (!selected) {
            return <Secondary>{t(placeholder)}</Secondary>;
          }
          return typeof selected === 'string' && languagesData.find((el) => selected === el.code).name;
        }}
        sx={{
          '& .MuiInputBase-input': {
            paddingTop: '8px',
            paddingBottom: '9px',
          },
        }}
      >
        {languagesData.map((el) => (
          <MenuItem key={el.id} value={el.code}>
            {t(el.name)} - {el.code}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
