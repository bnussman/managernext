import { useLinodeDisksQuery } from "../queries/linodes";
import { BoxProps, Card, HStack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { useTable } from "../utils/useTable";
import { Disk } from "@linode/api-v4";
import { Indicator } from "../components/Indicator";
import { ColumnModal } from "../components/ColumnModal";
import { Pagination } from "../components/Pagination";

interface Props {
  id: number;
}

const diskStatusMap: Record<Disk["status"], BoxProps["bgColor"]> = {
  offline: "gray.400",
  booting: "orange.400",
  provisioning: "orange.400",
  migrating: "orange.400",
  rebooting: "orange.400",
  shutting_down: "red.400",
  running: "green.400",
  ready: "green.400",
  deleting: "red.400",
}

export function Disks({ id }: Props) {
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
  } = useTable<Disk>({
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
        transform({ status }) {
          return (
            <HStack>
              <Indicator color={diskStatusMap[status]} />
              <Text textTransform="capitalize">{status}</Text>
            </HStack>
          );
        },
      },
      {
        label: "Size",
        key: 'size',
        filterable: true,
        transform({ size }) {
          return `${size / 1024} GB`;
        },
      },
      {
        label: "Created",
        key: 'created',
        filterable: true
      },
    ]
  });

  const { data, isLoading, error } = useLinodeDisksQuery(
    id,
    { page, page_size: pageSize },
    { "+order": order, "+order_by": orderBy }
  );

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Unable to load your Disks" />
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
            {data.data.map((disk) => (
              <Tr key={disk.id} >
                {columns.filter(column => !column.hidden).map((column) => (
                  <Td key={`${disk.id}-${column.key}`}>{column.transform ? column.transform(disk, compact) : String(disk[column.key as keyof Disk])}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
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