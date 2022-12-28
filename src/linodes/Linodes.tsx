import { useLinodesQuery } from "../queries/linodes";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { Pagination } from "../components/Pagination";
import { usePagination } from "../utils/usePagination";
import { useOrder } from "../utils/useOrder";
import {
  Button,
  Heading,
  HStack,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";

export function Linodes() {
  const { page, pageSize, handlePageChange, handlePageSizeChange } = usePagination();
  const { order, orderBy, handleOrderBy } = useOrder();

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
        <Heading>Linodes</Heading>
        <Spacer />
        <Button>Create Linode</Button>
      </HStack>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th onClick={() => handleOrderBy("label")}>Label</Th>
              <Th>Status</Th>
              <Th>Region</Th>
              <Th>IPv4</Th>
              <Th onClick={() => handleOrderBy("created")}>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.data.map((linode) => (
              <Tr key={linode.id}>
                <Td>{linode.label}</Td>
                <Td>{linode.status}</Td>
                <Td>{linode.region}</Td>
                <Td>{linode.ipv4[0]}</Td>
                <Td>{linode.created}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination
          page={page}
          pageSize={pageSize}
          setPage={handlePageChange}
          setPageSize={handlePageSizeChange}
          results={data?.results}
        />
      </TableContainer>
    </>
  );
};