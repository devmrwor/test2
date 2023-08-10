import { uniteRoutes } from "@/utils/uniteRoute";
import { NextPage } from "next";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Routes } from "../../common/enums/api-routes";

type WithRoleProps = {
  requiredRoles: string[];
  session: Session | null;
};

export default function publicRoute<T>(PageComponent: NextPage<T>): NextPage<WithRoleProps> {
  const PublicRoute: NextPage<WithRoleProps> = ({ ...props }) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const isAccessAllowed = !session?.user;

    useEffect(() => {
      if (status === "loading") return;
      if (!isAccessAllowed) {
        router.push(uniteRoutes([Routes.ROOT]));
      }
    }, [session, status]);

    if (status === "loading") return <p>Loading...</p>;

    // @ts-ignore
    return <PageComponent session={session} {...props} />;
  };

  return PublicRoute;
}
