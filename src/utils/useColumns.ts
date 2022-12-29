import { TableCellProps, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

export interface Column<T> {
  label: string;
  key?: keyof T;
  hidden?: boolean;
  filterable?: boolean;
  transform?: (entity: T, compact: boolean) => string | React.ReactNode;
  tdProps?: TableCellProps;
  hideLabel?: boolean;
}

export function useColumns<T>(props: { columns: Column<T>[] }) {
  const [columns, setColumns] = useState<Column<T>[]>(props.columns);

  const dialog = useDisclosure();

  const handleToggleColumnHidden = (key: string) => {
    setColumns((prev) => {
      const cols = [...prev];
      const idx = cols.findIndex(col => col.key === key);
      cols[idx].hidden = !cols[idx].hidden;
      return cols;
    });
  };

  return { columns, handleToggleColumnHidden, ...dialog };
}