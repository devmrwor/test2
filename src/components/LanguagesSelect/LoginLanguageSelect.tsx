import { FormControl, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Languages } from '../../../common/enums/languages';
import { ChevronDownIcon } from '../Icons/Icons';
import { useState, useEffect } from 'react';

export const LoginLanguageSelect = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [systemLang, setSystemLang] = useState<string | null>(null);
  const [selectorLang, setSelectorLang] = useState<string>(Languages.RU);

  useEffect(() => {
    try {
      const locale = localStorage.getItem('system_lang');
      if (['ru', 'en'].includes(locale)) {
        setSystemLang(locale);
        router.push(router.pathname, router.asPath, { locale });
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const changeLanguage = (newLocale: string) => {
    setSelectorLang(newLocale);
    router.push(router.pathname, router.asPath, { locale: systemLang ?? newLocale });
  };

  return (
    <FormControl sx={{ '& .MuiSelect-root': { outline: 'none' } }}>
      <Select
        onChange={(e) => {
          changeLanguage(e.target.value as string);
        }}
        IconComponent={ChevronDownIcon}
        size="small"
        labelId="label-id"
        id="select"
        value={selectorLang}
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: '#f3f3f3',
          },
          '& .MuiInputBase-input': {
            paddingRight: '26px !important',
          },
          '& .MuiSelect-select': {
            color: '#949494',
          },
          '& .MuiSelect-icon': { top: 15 },
          boxShadow: 'none',
          '.MuiOutlinedInput-notchedOutline': { border: 0 },
          '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            border: 0,
          },
          '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 0,
          },
        }}
      >
        <MenuItem value={Languages.RU}>RU</MenuItem>
        <MenuItem value={Languages.EN}>EN</MenuItem>
      </Select>
    </FormControl>
  );
};
