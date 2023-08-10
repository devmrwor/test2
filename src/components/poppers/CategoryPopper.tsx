import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { uniteRoutes } from "@/utils/uniteRoute";
import { Routes } from "../../../common/enums/api-routes";
import { Popper, Paper, ClickAwayListener } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CopyIcon, EditIcon, XmarkXs, ErrorIcon } from "../Icons/Icons";
import { EditTablePopup } from "@/components/EditTablePopup";

interface CategoryPopperProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleDelete: () => void;
  handleCopy: () => void;
  categoryId: number;
}

export const CategoryPopper = ({
  anchorEl,
  categoryId,
  handleClose,
  handleDelete,
  handleCopy,
}: CategoryPopperProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleEdit = () => {
    const url = uniteRoutes([Routes.CATEGORIES, categoryId]);
    router.push(url);
  };

  return (
    <Popper
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="right-start"
    >
      <ClickAwayListener onClickAway={handleClose}>
        <EditTablePopup
          handleEdit={handleEdit}
          handleCopy={handleCopy}
          handleDelete={handleDelete}
        />
      </ClickAwayListener>
    </Popper>
  );
};
