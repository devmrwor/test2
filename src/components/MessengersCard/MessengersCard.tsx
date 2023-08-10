import { uniteRoutes } from "@/utils/uniteRoute";
import Link from "next/link";
import { useRouter } from "next/router";
import { Routes, UserRoutes, UserSubRoutes } from "../../../common/enums/api-routes";
import { useTranslation } from "next-i18next";
import { MessengerItem } from "../../../common/types/messenger";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { messengersIcons } from "../../../common/constants/messengers";
import { Toggle } from "../primitives/Toggle/toggle";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "react-query";
import { useState } from "react";
import { toggleMessenger } from "@/services/profiles";
import { ChevronRight } from "@mui/icons-material";
import { ChevronRightXl } from "../Icons/Icons";

interface MessengersCardProps {
  data: MessengerItem;
}

export const MessengersCard = ({ data }: MessengersCardProps) => {
  const { t } = useTranslation();
  const { userId, userRole } = useRouter().query;
  const [isLoading, setIsLoading] = useState(false);
  const [isShowOthers, setIsShowOthers] = useState<boolean | undefined>(undefined);

  const toggleShowOthers = async () => {
    try {
      setIsLoading(true);
      const updateMessenger = await toggleMessenger(
        data.profileId,
        data.messenger.id,
        data.nicknameOrNumber
      );
      setIsShowOthers(updateMessenger.messenger.show_others || false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(data);

  const isShowOthersValue =
    isShowOthers === undefined ? data?.messenger?.show_others || false : isShowOthers;

  return (
    <div className="w-full">
      <Link
        href={uniteRoutes([
          Routes.USERS,
          userRole as string,
          userId as string,
          UserSubRoutes.PROFILES,
          data.profileId as number,
        ])}
        className="flex justify-between items-center mb-5 group cursor-pointer hover:text-primary-100"
      >
        <div className="flex items-center">
          <div className="mr-4">{messengersIcons[data.messenger.name]}</div>
          <p className="text-text-primary text-lg group-hover:text-primary-100 transition-all">
            {data.messenger.name}
          </p>
        </div>
        <ChevronRightXl fill="currentColor" />
      </Link>
      <div className="flex justify-between">
        <p className="text-text-secondary">{isLoading ? t("loading") : t("show_others")}</p>
        <Toggle disabled={isLoading} value={isShowOthersValue} onChange={toggleShowOthers} />
      </div>
    </div>
  );
};
