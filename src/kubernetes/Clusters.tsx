import { KubernetesCluster } from "@linode/api-v4";
import { dcDisplayNames } from "../utils/constants";
import { useKubernetesClustersQuery } from "../queries/kubernetes";
import { Indicator } from "../components/Indicator";
import { useNavigate } from "react-router-dom";
import { Column } from "../utils/useColumns";
import { Table } from "../utils/Table";
import {
  Button,
  Heading,
  HStack,
  Spacer,
  Text,
  BoxProps,
  Stack,
} from "@chakra-ui/react";

const statusMap: Record<KubernetesCluster["status"], BoxProps["bgColor"]> = {
  ready: 'green.300',
}

export function Clusters() {
  const navigate = useNavigate();
  const columns: Column<KubernetesCluster>[] = [
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
            <Indicator color={statusMap[status]} />
            <Text textTransform="capitalize">{status.replaceAll('_', ' ')}</Text>
          </HStack>
        );
      },
    },
    {
      label: "Version",
      key: 'k8s_version',
      filterable: true
    },
    {
      label: "HA",
      key: 'control_plane',
      transform({ control_plane }) {
        return <Indicator color={control_plane.high_availability ? 'green.300' : 'red.300'} />
      },
    },
    {
      label: "Region",
      key: 'region',
      transform({ region }) {
        return dcDisplayNames[region] ?? region;
      },
    },
    {
      label: "Updated",
      key: 'updated',
      filterable: true,
      hidden: true,
    },
    {
      label: "Created",
      key: 'created',
      filterable: true
    },
  ]

  return (
    <Stack>
      <HStack>
        <Heading letterSpacing="tight" size="lg">Kubernetes Clusters</Heading>
        <Spacer />
        <Button onClick={() => navigate("/kubernetes/create")}>
          Create Cluster
        </Button>
      </HStack>
      <Table entity="kubernetes" columns={columns} query={useKubernetesClustersQuery} clickable />
    </Stack>
  );
};