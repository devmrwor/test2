import { useTranslation } from "next-i18next";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import Link from "next/link";

interface CategoryDialogProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  handleDelete: () => void;
  categoryId: number;
}

export const CategoryDialog = ({
  openDialog,
  categoryId,
  handleCloseDialog,
  handleDelete,
}: CategoryDialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          {t("cancel")}
        </Button>
        <Link href={`/categories/${categoryId}`} passHref>
          <Button color="primary" component="a">
            {t("edit")}
          </Button>
        </Link>
        <Button onClick={handleDelete}>{t("delete")}</Button>
      </DialogActions>
    </Dialog>
  );
};
