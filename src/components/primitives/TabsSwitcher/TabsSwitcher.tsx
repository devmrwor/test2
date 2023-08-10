import { Tabs, Tab } from '@mui/material';
import { useTranslation } from 'next-i18next';

interface TabData {
  value: number | string;
  status: string;
}

interface TabsData {
  [key: string]: TabData;
}

interface TabsSwitcherProps {
  data: TabsData | { [key: string]: string };
  value: string;
  onValueChange: (event: React.SyntheticEvent, newValue: string) => void;
  classes?: string;
  fontSize?: string;
  plainObject?: boolean;
}

export const TabsSwitcher = ({
  data,
  value,
  onValueChange,
  classes,
  fontSize = '16px',
  plainObject = false,
}: TabsSwitcherProps) => {
  const { t } = useTranslation();

  return (
    <div className={classes}>
      <Tabs
        value={value}
        onChange={onValueChange}
        sx={{
          '.MuiTabs-flexContainer': {
            justifyContent: 'space-between',
          },
          '.MuiButtonBase-root': {
            padding: 0,
            paddingBottom: '9px',
            borderBottom: '1px solid #949494',
            fontSize: fontSize,
          },
          '.MuiTab-root': {
            color: '#949494',
            paddingTop: 0,
            paddingBottom: 0,
          },
          '.MuiTabs-indicator': {
            display: 'none',
          },
          '.Mui-selected': {
            color: '#33a1c9',
            borderBottom: '1px solid #33a1c9',
          },
        }}
      >
        {plainObject
          ? Object.entries(data).map(([key, value]) => <Tab key={key} label={`${t(value)}`} value={value} />)
          : Object.entries(data).map(([key, item]) => (
              <Tab key={key} label={`${t(key)} ${item.value}`} value={item.status} />
            ))}
      </Tabs>
    </div>
  );
};
