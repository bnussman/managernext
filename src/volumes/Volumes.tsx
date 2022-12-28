import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { Pagination } from "../components/Pagination";
import { usePagination } from "../utils/usePagination";
import { useOrder } from "../utils/useOrder";
import { useColumns } from "../utils/useColumns";
import { Volume } from "@linode/api-v4";
import { SettingsIcon } from "@chakra-ui/icons";
import { ColumnModal } from "../components/ColumnModal";
import { Indicator } from "../components/Indicator";
import { useVolumesQuery } from "../queries/volumes";
import {
  Button,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  BoxProps,
} from "@chakra-ui/react";

const statusMap: Record<Volume["status"], BoxProps["bgColor"]> = {
  active: 'green.300',
  creating: 'orange.300',
  resizing: 'orange.300',
  deleted: 'red.300',
  deleting: 'red.300',
  contact_support: 'red.300',
}

export function Volumes() {
  const { page, pageSize, handlePageChange, handlePageSizeChange } = usePagination();
  const { order, orderBy, handleOrderBy } = useOrder();

  const { columns, handleToggleColumnHidden, isOpen, onClose, onOpen } = useColumns<Volume>({
    columns: [
      {
        label: "ID",
        key: 'id',
        filterable: true
      },
      {
        label: "Label",
        key: 'label',
        filterable: true
      },
      {
        label: "Status",
        key: 'status',
        filterable: true,
        transform(status: Volume['status']) {
          return (
            <HStack>
              <Indicator color={statusMap[status]} />
              <Text textTransform="capitalize">{status}</Text>
            </HStack>
          );
        },
      },
      {
        label: "Size",
        key: 'size',
        transform(size: Volume['size']) {
          return `${size} GB`;
        },
        filterable: true,
      },
      {
        label: "Type",
        key: 'hardware_type',
        hidden: true,
      },
      {
        label: "Created",
        key: 'created',
        filterable: true
      },
    ]
  });

  const { data, isLoading, error } = useVolumesQuery(
    { page, page_size: pageSize },
    { '+order': order, '+order_by': orderBy }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <>
      <HStack>
        <Heading>Volumes</Heading>
        <Spacer />
        <IconButton onClick={onOpen} icon={<SettingsIcon />} aria-label="Table Settings" />
        <Button>Create Volume</Button>
      </HStack>
      <TableContainer>
        <Table>
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
            {data.data.map((linode) => (
              <Tr key={linode.id}>
                {columns.filter(column => !column.hidden).map((column) => (
                  <Td key={`${linode.id}-${column.key}`}>{column.transform ? column.transform(linode[column.key]) : String(linode[column.key])}</Td>
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
      />
      <ColumnModal
        isOpen={isOpen}
        onClose={onClose}
        columns={columns}
        handleToggleColumnHidden={handleToggleColumnHidden}
      />
    </>
  );
};