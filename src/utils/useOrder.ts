import { useSearchParams } from "react-router-dom";

export function useOrder() {
  const [searchParams, setSearchParams] = useSearchParams();

  const orderBy = searchParams.get('order_by') ?? undefined;
  const order = (searchParams.get('order') as 'asc' | 'desc') ?? undefined;

  const handleChangeOrder = (order: 'asc' | 'desc') => {
    searchParams.set('order', order)
    setSearchParams(searchParams);
  };

  const handleOrderBy = (key: string | undefined) => {
    if (!key) {
      return;
    }

    if (orderBy === key) {
      searchParams.set("order",  order === 'asc' ? 'desc' : 'asc');
      searchParams.set("order_by",  key);
      setSearchParams(searchParams);
    }
    else {
      searchParams.set("order_by", key);
      searchParams.set("order", "asc");
      setSearchParams(searchParams);
    }
  };

  return { order, orderBy, handleChangeOrder, handleOrderBy };
}