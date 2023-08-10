import { uniteRoutes } from "@/utils/uniteRoute";
import Link from "next/link";
import { useRouter } from "next/router";
import { Routes, UserRoutes, UserSubRoutes } from "../../../common/enums/api-routes";
import { useTranslation } from "next-i18next";

interface ProfileCardProps {
  name: string;
  id: string;
  surname: string;
}

export const ProfileCard = ({ name, id, surname }: ProfileCardProps) => {
  const { userId, userRole } = useRouter().query;

  return (
    <div className="border border-gray-300  rounded-md p-4 shadow-md hover:shadow-lg transition duration-300 mb-4">
      <Link
        href={uniteRoutes([
          Routes.USERS,
          userRole as string,
          userId as string,
          UserSubRoutes.PROFILES,
          id,
        ])}
      >
        <div className="cursor-pointer mb-4">
          <h2 className="text-lg font-medium text-gray-800 mb-3">{name}</h2>
          <p className="text-gray-600">{surname}</p>
        </div>
      </Link>
    </div>
  );
};
