import { Card, Text, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Heading, CardHeader, Tag, HStack, Spacer, BoxProps } from "@chakra-ui/react";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useLinodeBackupsQuery } from "../../queries/linodes";
import { Empty } from "../../components/Empty";
import { Indicator } from "../../components/Indicator";
import { LinodeBackup } from "@linode/api-v4";
import { getBackupDisksTotalSize } from "./utils";

interface Props {
  id: number;
}

export const backupStatusMap: Record<LinodeBackup["status"], BoxProps["bgColor"]> = {
  pending: "orange.300",
  running: "orange.300",
  paused: "gray.300",
  failed: "red.300",
  successful: "green.300",
  userAborted: "red.300",
  needsPostProcessing: "orange.300",
}

export function Automatic({ id }: Props) {
  const { data: backups, isLoading, error } = useLinodeBackupsQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error title="Unable to load your Backups" />
  }

  return (
    <Card p={4} pb={8} variant="outline">
      <CardHeader>
        <HStack>
          <Heading size="md">Automatic Backups</Heading>
          <Spacer />
          <Tag variant="outline">{backups.automatic.length}</Tag>
        </HStack>
      </CardHeader>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Created</Th>
              <Th>Status</Th>
              <Th>Disks</Th>
              <Th>Size</Th>
            </Tr>
          </Thead>
          <Tbody>
            {backups?.automatic.map((backup) => (
                <Tr key={backup.id}>
                  <Td>{backup.created}</Td>
                  <Td>
                    <HStack>
                      <Indicator color={backupStatusMap[backup.status]} />
                      <Text textTransform="capitalize">{backup.status}</Text>
                    </HStack>
                  </Td>
                  <Td>{backup.disks.map(disk => <Text id={disk.label}>{`${disk.label} - ${disk.size} MB`}</Text>)}</Td>
                  <Td>{getBackupDisksTotalSize(backup.disks) / 1024} GB</Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {backups.automatic.length === 0 && <Empty title="You have no Backups" />}
    </Card>
  );
}