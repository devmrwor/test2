import SideMenu from "@/components/UsersSideMenu";
import { UsersProvider } from "@/contexts/usersContext";
import { NextPage } from "next";

export default function withUsersLayout<T>(
  PageComponent: NextPage<T>,
  removeSidebar = false
): NextPage {
  const PageWithLayout: NextPage = ({ ...props }) => {
    return (
      <UsersProvider>
        <div className="flex gap-8 ">
          {!removeSidebar && <SideMenu />}
          <div className="grow">
            {/* @ts-ignore */}
            <PageComponent {...props} />
          </div>
        </div>
      </UsersProvider>
    );
  };

  return PageWithLayout;
}
