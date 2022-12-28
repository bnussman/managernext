import { useLinodesQuery } from "../queries/linodes";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { Pagination } from "../components/Pagination";
import { Linode } from "@linode/api-v4";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import { ColumnModal } from "../components/ColumnModal";
import { Indicator } from "../components/Indicator";
import { useTable } from "../utils/useTable";
import { useNavigate } from "react-router-dom";
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

const statusMap: Record<Linode["status"], BoxProps["bgColor"]> = {
  running: 'green.300',
  shutting_down: 'orange.300',
  stopped: 'red.300',
  rebooting: 'orange.300',
  restoring: 'orange.300',
  rebuilding: 'orange.300',
  offline: "gray.400",
  deleting: "red.300",
  booting: 'orange.300',
  migrating: 'orange.300',
  provisioning: 'orange.300',
  cloning: 'orange.300',
}

export function Linodes() {
  const navigate = useNavigate();
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
  } = useTable<Linode>({
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
        transform(status: Linode['status']) {
          return (
            <HStack>
              <Indicator color={statusMap[status]} />
              <Text textTransform="capitalize">{status}</Text>
            </HStack>
          );
        },
      },
      {
        label: "IPv4",
        key: 'ipv4',
        transform(value: string[]) {
          return value[0];
        },
      },
      {
        label: "Created",
        key: 'created',
        filterable: true
      },
    ]
  });

  const { data, isLoading, error } = useLinodesQuery(
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
        <Heading letterSpacing="tight" size="lg">Linodes</Heading>
        <Spacer />
        <IconButton onClick={onOpen} icon={<SettingsIcon />} aria-label="Table Settings" />
        <Button rightIcon={<AddIcon />}>Create Linode</Button>
      </HStack>
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
            {data.data.map((linode) => (
              <Tr
                key={linode.id}
                onClick={() => navigate(`/linodes/${linode.id}`)}
                cursor="pointer"
                _hover={{ bgColor: 'gray.50' }}
                _dark={{ _hover: { bgColor: 'gray.900' } }}
              >
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
        compact={compact}
        handleToggleColumnHidden={handleToggleColumnHidden}
        handleToggleCompact={handleToggleCompact}
      />
    </>
  );
};