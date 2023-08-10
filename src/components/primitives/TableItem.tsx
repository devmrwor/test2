import classNames from "classnames";
import { ReactNode } from "react";

interface TableLabelProps {
  children: ReactNode | string;
  position?: "left" | "center";
}

export const TableItem = ({ children, position = "center" }: TableLabelProps) => {
  return (
    <div
      className={classNames(
        "h-full w-full flex items-center",
        position === "center" ? "justify-center" : "justify-start"
      )}
    >
      {children}
    </div>
  );
};
