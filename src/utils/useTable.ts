import { useState } from "react";
import { Column, useColumns } from "./useColumns";
import { useOrder } from "./useOrder";
import { usePagination } from "./usePagination";

export function useTable<T>(props: { columns: Column<T>[] }) {
  const columns = useColumns(props);
  const order = useOrder();
  const pagination = usePagination();
  const [compact, setCompact] = useState(false);

  const handleToggleCompact = () => {
    setCompact(compact => !compact);
  };

  return {
    ...columns,
    ...order,
    ...pagination,
    compact,
    handleToggleCompact
  }
}