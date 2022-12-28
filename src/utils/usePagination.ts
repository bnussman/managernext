import { useSearchParams } from 'react-router-dom';

export const usePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page');
  const page = queryPage ? +queryPage : 1;

  const queryPageSize = searchParams.get('page_size');
  const pageSize = queryPageSize ? +queryPageSize : 25;

  const handlePageSizeChange = (newPageSize: number) => {
    searchParams.set("page_size", String(newPageSize))
    searchParams.set("page", "1")
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage: number) => {
    searchParams.set("page", String(newPage))
    setSearchParams(searchParams);
  };

  return {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  };
};