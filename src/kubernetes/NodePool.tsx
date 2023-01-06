import { RepeatIcon } from "@chakra-ui/icons";
import { Text, Card, CardHeader, HStack, Heading, Spacer, Button, CardBody, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Tag, Wrap, WrapItem, Spinner, Skeleton, IconButton } from "@chakra-ui/react";
import { KubeNodePoolResponse } from "@linode/api-v4";
import { useNavigate } from "react-router-dom";
import { Indicator } from "../components/Indicator";
import { statusMap } from "../linodes/Linodes";
import { useLinodesQuery, useLinodeTypesQuery } from "../queries/linodes";

export function NodePool({ type: typeId, nodes, count, autoscaler }: KubeNodePoolResponse) {
  const navigate = useNavigate();
  const { data: types } = useLinodeTypesQuery();

  const type = types?.data.find((t) => t.id === typeId)?.label ?? typeId;

  const linodeIds: number[] = nodes.reduce((acc: number[], node) => {
    if (node.instance_id === null) {
      return acc;
    }
    acc.push(node.instance_id);
    return acc;
  }, []);

  const { data: linodes } = useLinodesQuery({ page_size: 500 }, { '+or': linodeIds.map(id => ({ id })) });

  return (
    <Card variant="outline">
      <CardHeader>
        <Wrap>
          <WrapItem>
            <HStack alignContent="center" spacing={3}>
              <Heading size="md">{type}</Heading>
              <Tag variant="outline">{count} Nodes</Tag>
              {autoscaler.enabled && <Tag variant="outline" colorScheme="brand">Autoscaled</Tag>}
            </HStack>
          </WrapItem>
          <Spacer />
          <WrapItem>
            <Wrap>
              <WrapItem>
                <Button>Autoscale</Button>
              </WrapItem>
              <WrapItem>
                <Button>Resize</Button>
              </WrapItem>
              <WrapItem>
                <Button>Recycle</Button>
              </WrapItem>
              <WrapItem>
                <Button>Delete</Button>
              </WrapItem>
            </Wrap>
          </WrapItem>
        </Wrap>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Label</Th>
                <Th>IP</Th>
                <Th>Status</Th>
                <Th>Node Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {nodes.map((node) => {
                const linode = linodes?.data.find(l => l.id === node.instance_id);

                return (
                  <Tr
                    key={node.id}
                    onClick={() => navigate(`/linodes/${node.instance_id}`)}
                    cursor="pointer"
                    _hover={{ bgColor: 'gray.50' }}
                    _dark={{ _hover: { bgColor: "rgb(20, 24, 28)" } }}
                  >
                    <Td>{linode?.label ?? "Loading"}</Td>
                    <Td>{linode?.ipv4[0] ?? "Loading"}</Td>
                    <Td>
                      <HStack>
                        <Indicator color={statusMap[linode?.status ?? 'offline']} />
                        <Text textTransform="capitalize">{linode?.status ?? "Loading"}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack>
                        <Indicator color={node.status === 'ready' ? 'green.300' : "orange.300"} />
                        <Text textTransform="capitalize">{node.status}</Text>
                      </HStack>
                    </Td>
                    <Td p={0} pr={2} textAlign="right">
                      <IconButton size="sm" icon={<RepeatIcon />} aria-label={`Recycle node ${node.id}`} onClick={(e) => {
                        e.stopPropagation();
                      }} />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}