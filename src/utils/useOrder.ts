import { useState } from "react";

export function useOrder() {
  const [orderBy, setOrderBy] = useState<string>();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleChangeOrder = (order: 'asc' | 'desc') => {
    setOrder(order);
  };

  const handleOrderBy = (key: string) => {
    if (orderBy === key) {
      setOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
    }

    setOrderBy(key);
  };

  return { order, orderBy, handleChangeOrder, handleOrderBy };
}