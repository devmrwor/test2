import { TableCell, TableRow, TableHead as TableHeadMui } from "@mui/material";
import { ReactNode } from "react";

interface TableHeadProps {
  cells: ReactNode[];
}

export const TableHead = ({ cells }: TableHeadProps) => {
  const getBorderRadius = (index: number, length: number) => {
    if (index === 0) {
      return "6px 0 0 6px";
    } else if (index === length - 1) {
      return "0 6px 6px 0";
    } else {
      return "none";
    }
  };

  return (
    <TableHeadMui className="bg-secondary h-4 p-0 max-h-4 rounded-md overflow-hidden">
      <TableRow>
        {cells &&
          cells.map((cell, index) => (
            <TableCell
              sx={{
                borderRadius: getBorderRadius(index, cells.length),
                overflow: "hidden",
                borderBottom: "none",
              }}
            >
              {cell}
            </TableCell>
          ))}
      </TableRow>
    </TableHeadMui>
  );
};
