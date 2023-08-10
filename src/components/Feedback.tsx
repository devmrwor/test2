import { formatDate } from "@/utils/dateFormatter";
import { Avatar, Rating } from "@mui/material";
import { useTranslation } from "next-i18next";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { HideIcon } from "./Icons/Icons";

interface FeedbackProps {
  sentence: string;
  rating: number;
  date: Date;
  avatar: string;
  name: string;
}

export const Feedback = ({ sentence, rating, date, avatar, name }: FeedbackProps) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="flex flex-col mb-12 hover:bg-border-light p-4 cursor-pointer rounded"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between">
        <div className="flex flex-row items-center mb-3">
          <div className="flex flex-col items-center mr-4">
            <Avatar sx={{ height: 42, width: 42 }} alt={name} src={avatar} />
          </div>
          <div className="flex flex-col">
            <div className="text-base text-primary-100">{name}</div>
            <div className="text-xs text-gray-500">{formatDate(date)}</div>
          </div>
        </div>
        {isHovered && (
          <div className="flex justify-between gap-4  text-text-secondary relative -top-4">
            <div className="flex justify-between gap-1 items-center">
              <HideIcon />
              <p color="text-inherit">{t("hide")}</p>
            </div>
            <div className="flex justify-between gap-1 items-center text-text-secondary">
              <CloseIcon color="error" />
              <p>{t("remove")}</p>
            </div>
          </div>
        )}
      </div>
      <div className="mb-6">
        <Rating value={rating} readOnly />
      </div>
      <div className="">
        <h2 className="text-xl text-gray-700 font-medium">{t("comment")}</h2>
        <div className="text-lg text-gray-600">{sentence}</div>
      </div>
    </div>
  );
};
