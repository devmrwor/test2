import { Popper, Paper, ClickAwayListener } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { CopyIcon, EditIcon, XmarkXs, ErrorIcon, TrashCan } from "../Icons/Icons";

interface UsersPopperProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleDelete: () => void;
  handleCopy?: () => void;
  href: string;
  isEditAvailable: boolean;
}

export const UsersPopper = ({
  anchorEl,
  href,
  isEditAvailable = true,
  handleClose,
  handleCopy = () => {},
  handleDelete,
}: UsersPopperProps) => {
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
            {isEditAvailable && (
              <Link href={href} passHref>
                <button
                  type="button"
                  className="flex gap-2 px-2 py-1 justify-between hover:bg-background text-left text-sm items-center w-full"
                >
                  <div className="flex gap-2 items-center">
                    <EditIcon />
                    <span className="text-text-secondary text-base">{t("edit")} </span>
                  </div>
                  <ErrorIcon fill='#949494' />
                </button>
              </Link>
            )}
            <button
              type="button"
              className="flex gap-2 px-2 py-1 justify-between hover:bg-background text-left text-sm items-center w-full"
              onClick={handleCopy}
            >
              <div className="flex gap-2 items-center">
                <CopyIcon />
                <span className="text-text-secondary text-base">{t("copy")} </span>
              </div>
              <ErrorIcon fill='#949494' />
            </button>
            <button
              type="button"
              className="flex gap-2 px-2 py-1 justify-between hover:bg-background text-left text-sm items-center w-full"
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
