import { uniteRoutes } from "@/utils/uniteRoute";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Routes } from "../../../common/enums/api-routes";
import { UserRoutes } from "../../../common/enums/api-routes";

export default function UserPage() {
  const router = useRouter();
  useEffect(() => {
    router.push(uniteRoutes([Routes.USERS, UserRoutes.EXECUTORS]));
  }, []);

  return <div></div>;
}
