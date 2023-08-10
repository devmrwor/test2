import { TabsGroup } from '@/components/TabsGroup/TabsGroup';
import { useTranslation } from 'next-i18next';
import { languagesData } from '../../../common/constants/languages';

const data = languagesData.filter(el => ['uk', 'en', 'ru'].includes(el.code));

export const LanguagesSwitch = ({ value, onChange }) => {
    const { t } = useTranslation();

    const buttons = data.map(({ code }, i) => ({
      text: t(`languages.${code}`),
      isActive: (!value && !i) || value === code,
      onClick: () => onChange(code),
    }));

  return <TabsGroup buttons={buttons} />;
};
