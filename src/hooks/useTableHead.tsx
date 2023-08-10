import { CustomCheckbox } from '@/components/Checkbox/Checkbox';
import { TableLabel } from '@/components/primitives/TableLabel';
import { ChangeEvent, useState } from 'react';
import { TableHead as TableHeadComponent } from '@/components/primitives/TableHead/TableHead';

interface tableHeadItem {
  label: string;
  isActive: boolean;
  onClick: () => void;
  labelTip: string;
}

interface useTableHeadProps {
  tableHeadData: tableHeadItem[];
  isAllSelected: boolean | number;
  toggleIsAllSelected: ({ target }: ChangeEvent<HTMLInputElement>) => void;
}

export const useTableHead = ({ tableHeadData, isAllSelected, toggleIsAllSelected }: useTableHeadProps) => {
  const tableHeadCells = [
    <CustomCheckbox checked={!!isAllSelected} onChange={toggleIsAllSelected} />,
    ...tableHeadData.map((data) => (
      <TableLabel key={data.label} isActive={data.isActive} onClick={data.onClick} labelTip={data.labelTip}>
        {data.label}
      </TableLabel>
    )),
  ];

  const TableHead = <TableHeadComponent cells={tableHeadCells} />;

  return TableHead;
};
