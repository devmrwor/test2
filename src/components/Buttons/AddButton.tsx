import { AddCircleIconOutline } from "../Icons/Icons";
import { useTranslation } from "next-i18next";
import { BaseButton } from "./BaseButton";
import { FC, HTMLAttributes } from "react";

export const AddButton: FC<Partial<HTMLAttributes<HTMLButtonElement>>> = (props = {}) => {
  const { t } = useTranslation();

  return <BaseButton Icon={AddCircleIconOutline} text={t("add")} {...props} />;
};
