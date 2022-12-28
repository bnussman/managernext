import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

export interface Column<T> {
  label: string;
  key: keyof T;
  hidden?: boolean;
  filterable?: boolean;
  transform?: (value: any) => string | React.ReactNode;
}

export function useColumns<T>(props: { columns: Column<T>[] }) {
  const [columns, setColumns] = useState<Column<T>[]>(props.columns);
  const [compact, setCompact] = useState(false);

  const dialog = useDisclosure();

  const handleToggleCompact = () => {
    setCompact(compact => !compact);
  };

  const handleToggleColumnHidden = (key: string) => {
    setColumns((prev) => {
      const cols = [...prev];
      const idx = cols.findIndex(col => col.key === key);
      cols[idx].hidden = !cols[idx].hidden;
      return cols;
    });
  };

  return { columns, handleToggleColumnHidden, compact, handleToggleCompact, ...dialog };
}