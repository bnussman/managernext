import { Card } from "@chakra-ui/react";
import { Config } from "@linode/api-v4";
import { Column } from "../../utils/useColumns";
import { Table } from "../../utils/Table";
import { useLinodeConfigsQuery } from "../../queries/linodes";

interface Props {
  id: number;
}

export function Configs({ id }: Props) {
  const columns: Column<Config>[] = [
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
      label: "Root Device",
      key: "root_device",
    },
    {
      label: "Kernel",
      key: "kernel",
    },
    {
      label: "Devices",
      key: "devices",
      transform({ devices }) {
        return Object.values(devices).filter(device => device !== null).length;
      }
    },
    {
      label: "Created",
      key: 'created',
      filterable: true
    },
  ];

  return (
    <Card p={4} variant="outline">
      <Table
        columns={columns}
        query={(params, filter) => useLinodeConfigsQuery(id, params, filter)}
        entity="config"
      />
    </Card>
  );
}