import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { DeleteDialog } from "@/components/modals/DeleteDialogWarning";
import { TablePopper } from "@/components/poppers/TablePopper";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useState } from "react";

interface UseTableProps {
  getHref?: (id: number) => string;
  deleteSingle: (id: number) => void;
  deleteMultiple: (ids: number[]) => void;
  copySingle?: (id: number) => void;
  rows: { id: number }[];
  handleClick?: (id: number) => void;
}

export const useTable = ({
  getHref,
  rows,
  deleteSingle,
  deleteMultiple,
  copySingle,
  handleClick,
}: UseTableProps) => {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const isAllSelected = selectedRows.length && selectedRows.length === rows.length;

  console.log(rows);

  const addSelectedRow = (id: number) => {
    setSelectedRows((prev) => [...prev, id]);
  };

  const removeSelectedRow = (id: number) => {
    setSelectedRows((prev) => prev.filter((item) => item !== id));
  };

  const toggleSelectedRow = (id: number, event: ChangeEvent<HTMLInputElement>) => {
    if (selectedRows.includes(id)) {
      removeSelectedRow(id);
      setAnchorEl(null);
    } else {
      addSelectedRow(id);
    }
  };

  const handleOpen = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    if (selectedRows.includes(id)) {
      handleOpenPopper(event, id);
    } else {
      setAnchorEl(null);
    }
  };

  const toggleIsAllSelected = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!isAllSelected) {
      setAnchorEl(target);
      setSelectedRows(rows.map((item) => item.id));
    } else {
      setAnchorEl(null);
      setSelectedRows([]);
    }
  };

  const handleOpenPopper = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopper = () => {
    setSelectedRows([]);
    setAnchorEl(null);
  };

  const handleClose = (e: MouseEvent | TouchEvent) => {
    e.target.tagName !== "INPUT" && setAnchorEl(null);
  };

  const getIds = () => {
    return isAllSelected ? rows.map((item) => item.id) : selectedRows;
  };

  const isSingle = selectedRows.length === 1 && (!isAllSelected || rows.length === 1);

  const deleteMultipleHandler = () => {
    handleClosePopper();
    deleteMultiple(getIds());
  };

  const deleteSingleHandler = () => {
    handleClosePopper();
    deleteSingle(selectedRows[0]);
  };

  const copySingleHandler = () => {
    handleClosePopper();
    if (!copySingle) return;
    copySingle(selectedRows[0]);
  };

  const getIsRowSelected = (id: number) => {
    return selectedRows.includes(id) || isAllSelected;
  };

  const onDeleteHandler = () => {
    setIsDeleteDialogOpen(false);
    !isSingle ? deleteMultipleHandler() : deleteSingleHandler();
  };

  const popper = (
    <>
      <TablePopper
        href={isSingle && getHref && getHref(selectedRows[0])}
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleDelete={() => setIsDeleteDialogOpen(true)}
        handleCopy={isSingle && copySingle ? copySingleHandler : undefined}
        handleClick={handleClick}
        selectedRow={selectedRows[0]}
      />
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onSave={onDeleteHandler}
        onClose={() => setIsDeleteDialogOpen(false)}
        onBack={() => setIsDeleteDialogOpen(false)}
        customText={t("delete_warning_headline")}
        warningCaption={t("delete_warning_caption")}
        headerText={t("attention")}
        buttonText={t("yes")}
      />
    </>
  );

  return {
    popper,
    selectedRows,
    isAllSelected,
    toggleSelectedRow,
    toggleIsAllSelected,
    getIsRowSelected,
    handleOpen,
  };
};
