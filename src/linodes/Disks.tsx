import { useLinodeDisksQuery } from "../queries/linodes";
import { BoxProps, Card, HStack, Text } from "@chakra-ui/react";
import { Disk } from "@linode/api-v4";
import { Indicator } from "../components/Indicator";
import { Column } from "../utils/useColumns";
import { Table } from "../utils/Table";

interface Props {
  id: number;
}

const diskStatusMap: Record<Disk["status"], BoxProps["bgColor"]> = {
  offline: "gray.400",
  booting: "orange.400",
  provisioning: "orange.400",
  migrating: "orange.400",
  rebooting: "orange.400",
  shutting_down: "red.400",
  running: "green.400",
  ready: "green.400",
  deleting: "red.400",
}

export function Disks({ id }: Props) {
  const columns: Column<Disk>[] = [
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
            <Indicator color={diskStatusMap[status]} />
            <Text textTransform="capitalize">{status}</Text>
          </HStack>
        );
      },
    },
    {
      label: "Size",
      key: 'size',
      filterable: true,
      transform({ size }) {
        return `${size / 1024} GB`;
      },
    },
    {
      label: "Created",
      key: 'created',
      filterable: true
    },
  ];

  return (
    <Card p={4} variant="outline">
      <Table columns={columns} query={(params, filter) => useLinodeDisksQuery(id, params, filter)} />
    </Card>
  );
}