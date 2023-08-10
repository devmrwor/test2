import { ShareIcon } from "../Icons/Icons";
import { useTranslation } from "next-i18next";
import { BaseButton } from "./BaseButton";

export const ShareButton = (props = {}) => {
  const { t } = useTranslation();

  return (
    <BaseButton Icon={ShareIcon} text={t("share")} size="medium" {...props} />
  );
};
