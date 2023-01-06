import { Card, CardBody, Heading, Text, HStack, Spacer, Stack, Stat, StatHelpText, StatLabel, StatNumber, Wrap, WrapItem, Button, Box, Code } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Indicator } from "../components/Indicator";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { useKubernetesClusterAPIEndpointsQuery, useKubernetesClusterQuery } from "../queries/kubernetes";
import { dcDisplayNames } from "../utils/constants";
import { NodePools } from "./NodePools";

export function Cluster() {
  const { id } = useParams();

  const { data: cluster, isLoading, error } = useKubernetesClusterQuery(Number(id));
  const { data: endpoints } = useKubernetesClusterAPIEndpointsQuery(Number(id));

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Unable to load your cluster" />
  }

  return (
    <Stack spacing={4}>
      <Card variant="outline">
        <CardBody>
          <Stack spacing={4}>
            <HStack>
              <Heading size="md" isTruncated>{cluster.label}</Heading>
              <Spacer />
              <Text fontWeight="extrabold" textTransform="capitalize">{cluster.status.replaceAll("_", " ")}</Text>
              <Indicator color={cluster.status === 'ready' ? 'green.300' : 'orange.300'} />
            </HStack>
            <Wrap spacingX={16}>
              <WrapItem>
                <Stat>
                  <StatLabel>Version</StatLabel>
                  <StatNumber>{cluster.k8s_version}</StatNumber>
                  <StatHelpText>Kubernetes</StatHelpText>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Stat>
                  <StatLabel>Availability</StatLabel>
                  <StatNumber>{cluster.control_plane.high_availability ? "HA" : "Normal"}</StatNumber>
                  <StatHelpText>{cluster.control_plane.high_availability ? "Highly Available" : "Normal Availability"}</StatHelpText>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Stat>
                  <StatLabel>Region</StatLabel>
                  <StatNumber>{dcDisplayNames[cluster.region] ?? cluster.region}</StatNumber>
                  <StatHelpText textTransform="uppercase">{cluster.region.split("-")[0]}</StatHelpText>
                </Stat>
              </WrapItem>
              <WrapItem>
                <Box>
                  <Heading size="sm">Endpoints</Heading>
                  <Text>
                    {endpoints?.data.map(({ endpoint }) => (
                      <Text key={endpoint}>
                        <Code fontSize="xs">{endpoint}</Code>
                      </Text>
                    ))}
                  </Text>
                </Box>
              </WrapItem>
            </Wrap>
          </Stack>
        </CardBody>
      </Card>
      <NodePools clusterId={cluster.id} /> 
    </Stack>
  );
}