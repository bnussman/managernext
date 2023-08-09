import { NodeBalancer } from "@linode/api-v4";
import { useNodeBalancersQuery } from "../queries/nodebalancers";
import { useNavigate } from "react-router-dom";
import { Column } from "../utils/useColumns";
import { Table } from "../utils/Table";
import {
  Button,
  Heading,
  HStack,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { dcDisplayNames } from "../utils/constants";

export function NodeBalancers() {
  const navigate = useNavigate();
  const columns: Column<NodeBalancer>[] = [
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
      label: "IP",
      key: 'ipv4',
    },
    {
      label: "Hostname",
      key: 'hostname',
    },
    {
      label: "Region",
      key: 'region',
      transform({ region }) {
        return dcDisplayNames[region] ?? region;
      },
      filterable: true
    },
    {
      label: "Traffic In",
      key: "transfer",
      transform(nodebalancer) {
        return `${nodebalancer.transfer.in.toFixed(0)} MB`;
      },
    },
    {
      label: "Traffic Out",
      key: "transfer",
      transform(nodebalancer) {
        return `${nodebalancer.transfer.out.toFixed(0)} MB`;
      }
    },
  ]

  return (
    <Stack>
      <HStack>
        <Heading letterSpacing="tight" size="lg">NodeBalancers</Heading>
        <Spacer />
        <Button onClick={() => navigate("/nodebalancers/create")}>
          Create NodeBalancer
        </Button>
      </HStack>
      <Table entity="nodebalancers" columns={columns} query={useNodeBalancersQuery} clickable />
    </Stack>
  );
};