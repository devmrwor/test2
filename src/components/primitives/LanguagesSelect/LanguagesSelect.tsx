import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Languages } from "../../../../common/enums/languages";

export const LanguagesSelect = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const changeLanguage = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <FormControl fullWidth>
      <Select
        onChange={(e) => {
          changeLanguage(e.target.value as string);
        }}
        size="small"
        labelId="label-id"
        id="select"
        value={i18n.language}
        componentsProps={{
          input: {
            sx: { backgroundColor: "#f3f3f3" },
          },
        }}
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "#f3f3f3",
          },
        }}
      >
        <MenuItem value={Languages.EN}>En</MenuItem>
        <MenuItem value={Languages.RU}>Ru</MenuItem>
      </Select>
    </FormControl>
  );
};
