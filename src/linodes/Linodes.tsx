import { useLinodesQuery } from "../queries/linodes";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { Pagination } from "../components/Pagination";
import { usePagination } from "../utils/usePagination";
import {
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
  const { data, isLoading, error } = useLinodesQuery({ page, page_size: pageSize });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Label</Th>
            <Th>Status</Th>
            <Th>Region</Th>
            <Th>IPv4</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.data.map((linode) => (
            <Tr key={linode.id}>
              <Td>{linode.label}</Td>
              <Td>{linode.status}</Td>
              <Td>{linode.region}</Td>
              <Td>{linode.ipv4[0]}</Td>
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
  );
};