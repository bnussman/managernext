import { TableContainer, Thead, Tr, Th, Tbody, Td, Table as ChakraTable, useMediaQuery } from "@chakra-ui/react";
import { ResourcePage } from "@linode/api-v4/lib/types";
import { UseQueryResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { Params } from "./types";
import { Column } from "./useColumns";
import { useTable } from "./useTable";
import { Pagination } from "../components/Pagination";
import { ColumnModal } from "../components/ColumnModal";
import { Empty } from "../components/Empty";
import { capitalize } from "./capitalize";

interface Props<T> {
  columns: Column<T>[];
  query: (params: Params, filter: any) => UseQueryResult<ResourcePage<T>>;
  entity: string;
  clickable?: boolean;
  card?: (entity: T) => JSX.Element;
}

export function Table<T extends { id: string | number }>(props: Props<T>) {
  const navigate = useNavigate();
  const {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    order,
    orderBy,
    handleOrderBy,
    handleChangeOrder,
    columns,
    handleToggleColumnHidden,
    isOpen,
    onClose,
    onOpen,
    compact,
    cardView,
    handleToggleCompact,
    handleToggleCardView
  } = useTable<T>({ columns: props.columns });

  const getClickableProps = (entity: T) => {
    if (!props.clickable) {
      return {};
    }

    return {
      onClick: () => navigate(`/${props.entity}/${entity.id}`),
      cursor: "pointer",
      _hover: { bgColor: 'gray.50' },
      _dark: { _hover: { bgColor: "rgb(20, 24, 28)" } },
    };
  };
  
  const { data, isLoading, error } = props.query(
    { page, page_size: pageSize },
    { '+order': order, '+order_by': orderBy }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error title={`Unable to load your ${capitalize(props.entity)}s`} />;
  }

  return (
    <>
      {props.card && cardView ? (
        <>
          {data?.data.map((entity) => props.card?.(entity))}
        </>
      )
        :
        (
          <TableContainer>
            <ChakraTable size={compact ? 'sm' : 'md'}>
              <Thead>
                <Tr>
                  {columns.filter(column => !column.hidden).map((column) => (
                    <Th
                      key={column.label}
                      onClick={column.filterable ? () => handleOrderBy(column.key as string) : undefined}
                      cursor={column.filterable ? "pointer" : undefined}
                    >
                      {column.hideLabel ? null : column.label}
                      {column.key && orderBy === column.key ? (order === 'asc' ? " ⬆️" : " ⬇️") : null}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {data?.data.map((entity) => (
                  <Tr
                    key={entity.id}
                    {...getClickableProps(entity)}
                  >
                    {columns.filter(column => !column.hidden).map((column) => (
                      <Td {...column.tdProps} key={`${entity.id}-${column.key as string}`}>{column.transform ? column.transform(entity, compact) : String(entity[column.key as keyof T])}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </ChakraTable>
          </TableContainer>
        )}
      {data?.results === 0 && <Empty title={`You have no ${capitalize(props.entity)}s`} />}
      <Pagination
        page={page}
        pageSize={pageSize}
        setPage={handlePageChange}
        setPageSize={handlePageSizeChange}
        results={data?.results}
        onSettingsOpen={onOpen}
      />
      <ColumnModal
        isOpen={isOpen}
        onClose={onClose}
        columns={columns}
        compact={compact}
        cardView={cardView}
        handleToggleColumnHidden={handleToggleColumnHidden}
        handleToggleCompact={handleToggleCompact}
        handleToggleCardView={handleToggleCardView}
        order={order}
        orderBy={orderBy}
        handleChangeOrder={handleChangeOrder}
        handleOrderBy={handleOrderBy}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
      />
    </>
  );
}