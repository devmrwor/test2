import withLayout from "@/hocs/withLayout";
import { Roles } from "../../../common/enums/roles";
import withRole from "@/hocs/withRole";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useLayout } from "@/contexts/layoutContext";
import { uniteRoutes } from "@/utils/uniteRoute";
import { useTranslation } from "next-i18next";
import { Routes } from "../../../common/enums/api-routes";
import { NotificationForm } from "@/components/NotificationForm";
import { INotification } from "../../../common/types/notification";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { createNotification } from "@/services/notification";

const CreateNotificationPage = () => {
  const { setBreadcrumbs, addNotification } = useLayout();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    setBreadcrumbs([
      { route: uniteRoutes([Routes.ROOT]), name: t("home") },
      { route: uniteRoutes([Routes.USERS]), name: t("users") },
      { route: "", name: t("notifications") },
    ]);
  }, []);

  const { isLoading: isLoadingFormSubmit, mutateAsync } = useMutation<
    INotification,
    Error,
    INotification
  >(createNotification);

  const onSubmit = async (values: INotification) => {
    console.log(values);
    try {
      await mutateAsync(values);
      addNotification({
        type: "success",
        text: t("created_successfully"),
      });
      router.push(uniteRoutes([Routes.NOTIFICATIONS]));
    } catch {
      addNotification({
        type: "error",
        text: t("error_on_notification_create"),
      });
    }
  };

  return (
    <div className="flex flex-col pt-13.5">
      <NotificationForm isLoading={isLoadingFormSubmit} onSubmit={onSubmit} />
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default withRole(withLayout(CreateNotificationPage), [Roles.ADMIN]);
