import { useState } from 'react';

export interface PaginationProps {
  page: number;
  pageSize: number;
  handlePageChange: (v: number) => void;
  handlePageSizeChange: (v: number) => void;
}

export const usePagination = (initialPage: number = 1): PaginationProps => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(25);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  };
};