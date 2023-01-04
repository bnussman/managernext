import { useLinodesQuery, useLinodeTypesQuery } from "../queries/linodes";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { Pagination } from "../components/Pagination";
import { Linode } from "@linode/api-v4";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import { ColumnModal } from "../components/ColumnModal";
import { Indicator } from "../components/Indicator";
import { useTable } from "../utils/useTable";
import { useNavigate } from "react-router-dom";
import { Menu } from "./Menu";
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

export const statusMap: Record<Linode["status"], BoxProps["bgColor"]> = {
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
  const { data: types, isLoading: isTypesLoading } = useLinodeTypesQuery();
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
        transform({ status }) {
          return (
            <HStack>
              <Indicator color={statusMap[status]} />
              <Text textTransform="capitalize">{status.replaceAll('_', ' ')}</Text>
            </HStack>
          );
        },
      },
      {
        label: "Type",
        key: 'type',
        hidden: true,
      },
      {
        label: "IPv4",
        key: 'ipv4',
        transform({ ipv4 }) {
          return ipv4[0];
        },
      },
      {
        label: "Created",
        key: 'created',
        filterable: true
      },
      {
        label: "Actions",
        tdProps: { p: 0, textAlign: 'center' },
        hideLabel: true,
        transform(linode, compact) {
          return (
            <Menu linode={linode} compact={compact} />
          );
        }
      },
    ]
  });

  const { data, isLoading, error } = useLinodesQuery(
    { page, page_size: pageSize },
    { '+order': order, '+order_by': orderBy }
  );

  if (isLoading || isTypesLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error title="Unable to load your Linodes" />;
  }

  return (
    <>
      <HStack>
        <Heading letterSpacing="tight" size="lg">Linodes</Heading>
        <Spacer />
        <IconButton onClick={onOpen} icon={<SettingsIcon />} aria-label="Table Settings" />
        <Button onClick={() => navigate("/linodes/create")} rightIcon={<AddIcon />}>Create Linode</Button>
      </HStack>
      <TableContainer>
        <Table size={compact ? 'sm' : 'md'}>
          <Thead>
            <Tr>
              {columns.filter(column => !column.hidden).map((column) => (
                <Th
                  key={column.label}
                  onClick={column.filterable ? () => handleOrderBy(column.key) : undefined}
                  cursor={column.filterable ? "pointer" : undefined}
                >
                  {column.hideLabel ? null : column.label}
                  {column.key && orderBy === column.key ? (order === 'asc' ? " ⬆️" : " ⬇️"): null}
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
                _dark={{ _hover: { bgColor: "rgb(20, 24, 28)" } }}
              >
                {columns.filter(column => !column.hidden).map((column) => (
                  <Td {...column.tdProps} key={`${linode.id}-${column.key}`}>{column.transform ? column.transform(linode, compact) : String(linode[column.key as keyof Linode])}</Td>
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
    </>
  );
};