import { ShareIcon } from "../Icons/Icons";
import { useTranslation } from "next-i18next";
import { BaseButton } from "./BaseButton";

export const SuccessOutline = (props = {}) => {
  const { t } = useTranslation();

  return <BaseButton size="large" type="outline" color="success" {...props} />;
};
