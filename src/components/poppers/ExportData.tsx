import Link from "next/link";
import { useTranslation } from "next-i18next";
import { uniteRoutes } from "@/utils/uniteRoute";
import { Routes } from "../../../common/enums/api-routes";
import { Popper, Paper, ClickAwayListener } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CopyIcon, EditIcon, XmarkXs, ErrorIcon, TrashCan } from "../Icons/Icons";

interface ExportDataPopperProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleDelete: () => void;
}

export const ExportDataPopper = ({
  anchorEl,
  handleClose,
  handleDelete,
}: ExportDataPopperProps) => {
  const { t } = useTranslation();

  return (
    <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="right-start">
      <ClickAwayListener onClickAway={handleClose}>
        <Paper
          sx={{
            top: "12px !important",
            position: "relative !important",
            boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.25) !important",
          }}
        >
          <div className="flex flex-col w-53.5 py-2">
            <button
              type="button"
              className="flex gap-2 px-2 py-1 justify-between rounded-md hover:bg-background text-left text-sm items-center w-full"
              onClick={handleDelete}
            >
              <div className="flex gap-2 items-center">
                <TrashCan />
                <span className="text-text-secondary text-base">{t("delete")} </span>
              </div>
              <ErrorIcon />
            </button>
          </div>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};
