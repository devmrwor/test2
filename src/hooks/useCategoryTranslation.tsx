import { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface ITranslation {
    language: string;
}

// Hook accepts initial category data
const useCategoryTranslation = (data?: any) => {
    const { i18n } = useTranslation();
  // State for the selected language and translations
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  // @ts-ignore
  const [translations, setTranslations] = useState<ITranslation[]>(data?.translations || []);

  const updateTranslations = (source: ITranslation[] | undefined) => {
    setTranslations(source || []);
  };

  // Method to change the selected language
  const changeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
  };

  // Method to update a field in the selected language
  const updateField = (fieldName: string, fieldValue: string) => {
    const item = translations.find((el) => el.language === selectedLanguage);
    if (!item) {
      // @ts-ignore
      return setTranslations((prevTranslations) => [
        ...prevTranslations,
        {
          language: selectedLanguage,
          [fieldName]: fieldValue,
        },
      ]);
    }

    const updated = {
      ...item,
      [fieldName]: fieldValue,
    };

    const list = translations.filter((el) => el.language !== selectedLanguage);

    setTranslations([...list, updated]);
  };

  // Get the value for a field in the selected language
    const getField = (fieldName: string | undefined) => {
        const item = translations.find((el) => el.language === selectedLanguage);
        const source = item || data || {};
      // @ts-ignore
    return source[fieldName];
  };

  const getFieldValue = (fieldName: string, data: any, language?: string) => {
    const lang = language ? language : selectedLanguage;
    const list = data?.translations || [];
    const item = list.find((el) => el.language === lang);
    const source = item || data || {};
    return source[fieldName];
  };

  return {
    updateTranslations,
    selectedLanguage,
    changeLanguage,
    getFieldValue,
    translations,
    updateField,
    getField,
  };
};

export default useCategoryTranslation;
