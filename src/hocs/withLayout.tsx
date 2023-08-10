import Breadcrumbs from "@/components/BreadCrumbs";
import { Header } from "@/components/Header";
import NotificationContainer from "@/components/NotificationContainer/NotificationContainer";
import SideMenu from "@/components/menu/SideMenu/SideMenu";
import { LayoutProvider, useLayout } from "@/contexts/layoutContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import classNames from "classnames";
import { NextPage } from "next";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function withLayout<T>(
  PageComponent: NextPage<T>,
  sideMenu = true,
  removeSpace = false
): NextPage {
  const PageWithLayout: NextPage = ({ ...props }) => {
    return (
      <LayoutProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Header />
          <main className={classNames("ml-5 mr-8.75 flex gap-2 flex-wrap pt-4 scrollbar-none")}>
            <Breadcrumbs />
            <div className="flex w-full gap-4">
              {sideMenu && <SideMenu removeSpace={removeSpace} />}
              <div className="grow no-scrollbar">
                {/* @ts-ignore */}
                <PageComponent {...props} />
              </div>
            </div>
          </main>
          <NotificationContainer />
          <div id="notification-container"></div>
        </LocalizationProvider>
      </LayoutProvider>
    );
  };

  return PageWithLayout;
}
