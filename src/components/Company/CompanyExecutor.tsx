import { TabsSwitcher } from '../primitives/TabsSwitcher/TabsSwitcher';
import { ExecutorMenuTabs } from '../../../common/enums/executor-type';
import { useState } from 'react';
import { MainTabCompany } from './MainTabCompany';
import { Navigation } from '../Navigation/Navigation';
import { NavigationMenu } from '../../../common/enums/navigation-menu';

const CUSTOMER_SERVICES = 0;

interface TabData {
  value: number | string;
  status: string;
}

interface TabsData {
  [key: string]: TabData;
}

export const CompanyExecutor = () => {
  const [selectedTab, setSelectedTab] = useState<string>(ExecutorMenuTabs.MAIN);
  const [servicesQuantity, setServicesQuantity] = useState<number>(CUSTOMER_SERVICES);

  const TabsData: TabsData = Object.entries(ExecutorMenuTabs).reduce((acc: TabsData, [, status]) => {
    acc[status] = { value: status === ExecutorMenuTabs.SERVICES ? servicesQuantity : '', status };
    return acc;
  }, {});

  const handleTabsChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <TabsSwitcher data={TabsData} value={selectedTab} onValueChange={handleTabsChange} fontSize="18px" />
      {selectedTab === ExecutorMenuTabs.MAIN && <MainTabCompany />}
      <Navigation selectedRoute={NavigationMenu.PROFILE} />
    </>
  );
};
