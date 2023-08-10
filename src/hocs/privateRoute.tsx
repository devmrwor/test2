import { uniteRoutes } from "@/utils/uniteRoute";
import { NextPage } from "next";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthRoutes, Routes } from "../../common/enums/api-routes";

type WithRoleProps = {
  requiredRoles: string[];
  session: Session | null;
};

export default function privateRoute<T>(PageComponent: NextPage<T>): NextPage<WithRoleProps> {
  const PrivateRoute: NextPage<WithRoleProps> = ({ ...props }) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const isAccessAllowed = session?.user;

    useEffect(() => {
      if (status === "loading") return;
      if (!isAccessAllowed) {
        router.push(uniteRoutes([Routes.AUTH, AuthRoutes.LOGIN]));
      }
    }, [session, status]);

    if (status === "loading" || !isAccessAllowed) return <p>Loading...</p>;

    // @ts-ignore
    return <PageComponent session={session} {...props} />;
  };

  return PrivateRoute;
}
