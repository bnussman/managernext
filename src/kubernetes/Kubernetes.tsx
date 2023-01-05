import { KubernetesCluster } from "@linode/api-v4";
import { useKubernetesClustersQuery } from "../queries/kubernetes";
import { AddIcon } from "@chakra-ui/icons";
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

export function Kubernetes() {
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
      label: "Region",
      key: 'region',
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
        <Button onClick={() => navigate("/kubernetes/create")} rightIcon={<AddIcon />}>Create Cluster</Button>
      </HStack>
      <Table entity="kubernetes" columns={columns} query={useKubernetesClustersQuery} clickable />
    </Stack>
  );
};