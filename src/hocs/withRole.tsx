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

export default function withRole<T>(
  PageComponent: NextPage<T>,
  requiredRoles: string[]
): NextPage<WithRoleProps> {
  const WithRole: NextPage<WithRoleProps> = ({ ...props }) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const isAccessAllowed =
      session?.user && requiredRoles.length > 0 && requiredRoles.includes(session.user.role);

    useEffect(() => {
      if (status === "loading") return;
      if (!session) {
        router.push(uniteRoutes([Routes.AUTH, AuthRoutes.LOGIN]));
      }
      if (!isAccessAllowed) {
        router.push(uniteRoutes([Routes.FORBIDDEN]));
      }
    }, [session, status]);

    if (status === "loading") return <p>Loading...</p>;

    if (!isAccessAllowed) {
      return <p>Forbidden 403</p>;
    }
    // @ts-ignore
    return <PageComponent session={session} {...props} />;
  };

  return WithRole;
}
