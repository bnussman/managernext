import { useLinodeVolumesQuery } from "../queries/linodes";
import { BoxProps, Card, HStack, Text } from "@chakra-ui/react";
import { Volume } from "@linode/api-v4";
import { Indicator } from "../components/Indicator";
import { Column } from "../utils/useColumns";
import { Table } from "../utils/Table";

interface Props {
  id: number;
}

export const volumeStatusMap: Record<Volume["status"], BoxProps["bgColor"]> = {
  creating: "orange.400",
  resizing: "orange.400",
  migrating: "orange.400",
  active: "green.400",
  offline: "grey.400",
}

export function Volumes({ id }: Props) {

  const columns: Column<Volume>[] = [
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
            <Indicator color={volumeStatusMap[status]} />
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
        return `${size} GB`;
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
      <Table entity="volume" columns={columns} query={(params, filter) => useLinodeVolumesQuery(id, params, filter)} />
    </Card>
  );
}