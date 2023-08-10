import { TableRow } from "@mui/material";

interface CustomTableRowProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const CustomTableRow = ({ children, isActive }: CustomTableRowsProps) => {
  return (
    <TableRow
      sx={{
        "&:hover": {
          backgroundColor: isActive ? "#f4faf2" : "#F7F7F7",
        },
        backgroundColor: isActive ? "#f4faf2" : "transparent",
      }}
    >
      {children}
    </TableRow>
  );
};
