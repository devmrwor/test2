import { TabsSwitcher } from '../primitives/TabsSwitcher/TabsSwitcher';
import { ExecutorMenuTabs } from '../../../common/enums/executor-type';
import { useState } from 'react';
import { MainTab } from './MainTab';
import { Navigation } from '../Navigation/Navigation';
import { NavigationMenu } from '../../../common/enums/navigation-menu';
import { useClientContext } from '@/contexts/clientContext';
import { ServicesTab } from './ServicesTab';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

interface TabData {
  value: number | string;
  status: string;
}

interface TabsData {
  [key: string]: TabData;
}

export const IndividualExecutor = () => {
  const { userData } = useClientContext();
  const [selectedTab, setSelectedTab] = useState<string>(ExecutorMenuTabs.MAIN);

  const TabsData: TabsData = Object.entries(ExecutorMenuTabs).reduce((acc: TabsData, [, status]) => {
    acc[status] = { value: status === ExecutorMenuTabs.SERVICES ? userData?.profiles?.length : '', status };
    return acc;
  }, {});

  const handleTabsChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <TabsSwitcher data={TabsData} value={selectedTab} onValueChange={handleTabsChange} fontSize="18px" />
      {selectedTab === ExecutorMenuTabs.MAIN && <MainTab />}
      {selectedTab === ExecutorMenuTabs.SERVICES && <ServicesTab services={userData?.profiles} />}
      <Navigation selectedRoute={NavigationMenu.PROFILE} />
    </>
  );
};
