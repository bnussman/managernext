import { Card, CardHeader, Heading, HStack, Text, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useLinodeIPsQuery } from "../../queries/linodes";
import { Empty } from "../../components/Empty";
import { Indicator } from "../../components/Indicator";

interface Props {
  id: number;
}

export function IPv6({ id }: Props) {
  const { data, isLoading, error } = useLinodeIPsQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error title="Unable to load your Backups" />
  }

  if (!data.ipv6) {
    return null;
  }

  const ips = [
    data.ipv6.link_local,
    data.ipv6.slaac,
  ];

  return (
    <Card p={4} pb={8} variant="outline">
      <CardHeader>
        <HStack>
          <Heading size="md">IPv6</Heading>
        </HStack>
      </CardHeader>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Public</Th>
              <Th>Subnet Mask</Th>
              <Th>Gateway</Th>
              <Th>rDNS</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ips.map((ip) => (
              <Tr key={ip.address}>
                <Td>{ip.address}</Td>
                <Td>
                  <HStack>
                    <Indicator color={ip.public ? 'green.300' : 'red.300'} />
                    <Text>{ip.public ? "Public" : "Private"}</Text>
                  </HStack>
                </Td>
                <Td>{ip.subnet_mask}</Td>
                <Td>{ip.gateway ?? "N/A"}</Td>
                <Td>{ip.rdns ?? "N/A"}</Td>
              </Tr>
            )
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {ips.length === 0 && <Empty title="You have no IPs" />}
    </Card>
  );
}