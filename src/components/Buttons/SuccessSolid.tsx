import { ShareIcon } from "../Icons/Icons";
import { useTranslation } from "next-i18next";
import { BaseButton } from "./BaseButton";

export const SuccessSolid = (props = {}) => {
  const { t } = useTranslation();

  return (
    <BaseButton size="large" type="solid" color="success" {...props} />
  );
};
