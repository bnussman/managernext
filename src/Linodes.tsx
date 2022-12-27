import { DataGridPro, GridColumns, GridColumnVisibilityModel, GridToolbar } from "@mui/x-data-grid-pro";
import { useState } from "react";
import { useLinodesQuery } from "./queries/linodes";
import { useFilter } from "./utils/useFilter";
import { usePagination } from "./utils/usePagination";

const columns: GridColumns = [
  { field: 'id', headerName: "ID", type: "number", flex: 1 },
  { field: 'label', headerName: "Label", flex: 1 },
  { field: 'status', headerName: "Status", flex: 1 },
  { field: 'region', headerName: "Region", flex: 1 },
  { field: 'type', headerName: "Type", flex: 1 },
  { field: 'updated', headerName: "Updated", type: 'date', flex: 1 },
  { field: 'created', headerName: "Created", type: 'date', flex: 1 },
];

export function Linodes() {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    id: true,
    label: true,
    region: true,
  });

  const { page, pageSize, handlePageChange, handlePageSizeChange } = usePagination(1);
  const { filter, filterModel, handleFilterModelChange, handleSortModelChange } = useFilter();

  const { data, isLoading } = useLinodesQuery(
    { page, page_size: pageSize },
    filter
  );

  // console.log("Filter", filter);
  // console.log("Filter Model", filterModel);
  // console.log("Hidden Cols", columnVisibilityModel);

  return (
    <DataGridPro
      style={{ minHeight: 600 }}
      rows={data?.data ?? []}
      getRowId={item => item.id}
      rowCount={data?.results ?? 0}
      loading={isLoading}
      rowsPerPageOptions={[25, 50, 100]}
      pagination
      page={page}
      pageSize={pageSize}
      paginationMode="server"
      onPageChange={(newPage) => handlePageChange(newPage)}
      onPageSizeChange={(newPageSize) => handlePageSizeChange(newPageSize)}
      columns={columns}
      filterMode="server"
      onFilterModelChange={handleFilterModelChange}
      filterModel={filterModel}
      sortingMode="server"
      onSortModelChange={handleSortModelChange}
      components={{ Toolbar: GridToolbar }}
      onColumnVisibilityModelChange={setColumnVisibilityModel}
      columnVisibilityModel={columnVisibilityModel}
      componentsProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
    />
  );
};
