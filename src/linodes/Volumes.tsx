import { useLinodeVolumesQuery } from "../queries/linodes";
import { BoxProps, Card, HStack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { useTable } from "../utils/useTable";
import { Volume } from "@linode/api-v4";
import { Indicator } from "../components/Indicator";
import { ColumnModal } from "../components/ColumnModal";
import { Pagination } from "../components/Pagination";
import { Empty } from "../components/Empty";

interface Props {
  id: number;
}

export const volumeStatusMap: Record<Volume["status"], BoxProps["bgColor"]> = {
  creating: "orange.400",
  resizing: "orange.400",
  migrating: "orange.400",
  deleted: "red.400",
  contact_support: "red.400",
  deleting: "red.400",
  active: "green.400",
}

export function Volumes({ id }: Props) {
  const {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    order,
    orderBy,
    handleOrderBy,
    columns,
    handleToggleColumnHidden,
    isOpen,
    onClose,
    onOpen,
    compact,
    handleToggleCompact
  } = useTable<Volume>({
    columns: [
      {
        label: "ID",
        key: 'id',
        filterable: true,
        hidden: true,
      },
      {
        label: "Label",
        key: 'label',
        filterable: true
      },
      {
        label: "Status",
        key: 'status',
        transform(status: Volume['status']) {
          return (
            <HStack>
              <Indicator color={volumeStatusMap[status]} />
              <Text textTransform="capitalize">{status}</Text>
            </HStack>
          );
        },
      },
      {
        label: "Size",
        key: 'size',
        filterable: true,
        transform(size: Volume['size']) {
          return `${size} GB`;
        },
      },
      {
        label: "Created",
        key: 'created',
        filterable: true
      },
    ]
  });

  const { data, isLoading, error } = useLinodeVolumesQuery(
    id,
    { page, page_size: pageSize },
    { "+order": order, "+order_by": orderBy }
  );

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Unable to load your Volumes" />
  }


  return (
    <Card p={4} variant="outline">
      <TableContainer>
        <Table size={compact ? 'sm' : 'md'}>
          <Thead>
            <Tr>
              {columns.filter(column => !column.hidden).map((column) => (
                <Th
                  key={column.key}
                  onClick={column.filterable ? () => handleOrderBy(column.key) : undefined}
                  cursor={column.filterable ? "pointer" : undefined}
                >
                  {column.label}
                  {orderBy === column.key && (order === 'asc' ? " ⬆️" : " ⬇️")}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.data.map((volume) => (
              <Tr key={volume.id} >
                {columns.filter(column => !column.hidden).map((column) => (
                  <Td key={`${volume.id}-${column.key}`}>{column.transform ? column.transform(volume[column.key]) : String(volume[column.key])}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {data.results === 0 && <Empty title="You have no Volumes" />}
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
        handleToggleColumnHidden={handleToggleColumnHidden}
        handleToggleCompact={handleToggleCompact}
      />
    </Card>
  );
}