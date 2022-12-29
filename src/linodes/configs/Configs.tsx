import { useLinodeConfigsQuery } from "../../queries/linodes";
import { BoxProps, Card, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Loading } from '../../components/Loading';
import { Error } from '../../components/Error';
import { useTable } from "../../utils/useTable";
import { Config, Disk } from "@linode/api-v4";
import { ColumnModal } from "../../components/ColumnModal";
import { Pagination } from "../../components/Pagination";

interface Props {
  id: number;
}

export const diskStatusMap: Record<Disk["status"], BoxProps["bgColor"]> = {
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

export function Configs({ id }: Props) {
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
  } = useTable<Config>({
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
        label: "Root Device",
        key: "root_device",
      },
      {
        label: "Kernel",
        key: "kernel",
      },
      {
        label: "Devices",
        key: "devices",
        transform({ devices }) {
          return Object.values(devices).filter(device => device !== null).length;
        }
      },
      {
        label: "Created",
        key: 'created',
        filterable: true
      },
    ]
  });

  const { data, isLoading, error } = useLinodeConfigsQuery(
    id,
    { page, page_size: pageSize },
    { "+order": order, "+order_by": orderBy }
  );

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Unable to load Configs" />
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
                  <Td key={`${disk.id}-${column.key}`}>{column.transform ? column.transform(disk, compact) : String(disk[column.key as keyof Config])}</Td>
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