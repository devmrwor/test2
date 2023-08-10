import { useTranslation } from "next-i18next";
import { Paper } from "@mui/material";
import {
  CopyIcon,
  EditIcon,
  XmarkXs,
  ErrorIcon,
  TrashCan,
} from "../Icons/Icons";

interface PopperProps {
  handleEdit: () => void | undefined;
  handleDelete: () => void | undefined;
  handleCopy: () => void | undefined;
}

export const EditTablePopup = ({
  handleEdit,
  handleDelete,
  handleCopy,
}: PopperProps) => {
  const { t } = useTranslation();
    const isSingle = !!(handleEdit && handleCopy);

  return (
    <Paper
      sx={{
        top: "12px !important",
        position: "relative !important",
        boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.25) !important",
      }}
    >
      <div className="flex flex-col w-53.5 py-2">
        {isSingle && (
          <>
            <button
              type="button"
              className="flex gap-2 px-2 py-1 justify-between rounded-md hover:bg-background text-left text-sm items-center w-full"
              onClick={handleEdit}
            >
              <div className="flex gap-2 items-center">
                <EditIcon />
                <span className="text-text-secondary text-base">
                  {t("edit")}{" "}
                </span>
              </div>
              <ErrorIcon fill="#949494" />
            </button>
            <button
              type="button"
              className="flex gap-2 px-2 py-1 justify-between rounded-md hover:bg-background text-left text-sm items-center w-full"
              onClick={handleCopy}
            >
              <div className="flex gap-2 items-center">
                <CopyIcon />
                <span className="text-text-secondary text-base">
                  {t("copy")}{" "}
                </span>
              </div>
              <ErrorIcon fill="#949494" />
            </button>
          </>
        )}
        <button
          type="button"
          className="flex gap-2 px-2 py-1 justify-between rounded-md hover:bg-background text-left text-sm items-center w-full"
          onClick={handleDelete}
        >
          <div className="flex gap-2 items-center">
            <TrashCan />
            <span className="text-text-secondary text-base">
              {t("delete")}{" "}
            </span>
          </div>
          <ErrorIcon />
        </button>
      </div>
    </Paper>
  );
};
