import { useEffect, useState } from "react";
import { Column, useColumns } from "./useColumns";
import { useOrder } from "./useOrder";
import { usePagination } from "./usePagination";
import { useBreakpointValue } from '@chakra-ui/react'

export function useTable<T>(props: { columns: Column<T>[] }) {
  const columns = useColumns({ columns: props.columns });
  const order = useOrder();
  const pagination = usePagination();
  const [compact, setCompact] = useState(false);
  const [cardView, setCardView] = useState(false);
  const isMobile = useBreakpointValue({ base: false, sm: true }, { fallback: "sm" })

  useEffect(() => {
    if(!isMobile && cardView === false) {
      setCardView(true);
    }
    if(isMobile && cardView === true) {
      setCardView(false);
    }
  }, [isMobile])

  const handleToggleCompact = () => {
    setCompact(compact => !compact);
  };

  const handleToggleCardView = () => {
    setCardView(compact => !compact);
  };

  return {
    ...columns,
    ...order,
    ...pagination,
    compact,
    cardView, 
    handleToggleCompact,
    handleToggleCardView
  }
}