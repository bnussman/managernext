import { useLinodesQuery, useLinodeTypesQuery } from "../queries/linodes";
import { Linode } from "@linode/api-v4";
import { AddIcon } from "@chakra-ui/icons";
import { Indicator } from "../components/Indicator";
import { useNavigate } from "react-router-dom";
import { Menu } from "./Menu";
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
  const columns: Column<Linode>[] = [
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
      label: "Type",
      key: 'type',
      hidden: true,
      filterable: true,
      transform({ type }) {
        const Type = () => {
          const { data: types } = useLinodeTypesQuery();
          return <p>{types?.data.find(t => t.id === type)?.label ?? "Unknown Plan"}</p>;
        };
        return <Type />
      },
    },
    {
      label: "IPv4",
      key: 'ipv4',
      transform({ ipv4 }) {
        return ipv4[0];
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

  return (
    <Stack>
      <HStack>
        <Heading letterSpacing="tight" size="lg">Linodes</Heading>
        <Spacer />
        <Button onClick={() => navigate("/linodes/create")} rightIcon={<AddIcon />}>Create Linode</Button>
      </HStack>
      <Table entity="linode" columns={columns} query={useLinodesQuery} clickable />
    </Stack>
  );
};