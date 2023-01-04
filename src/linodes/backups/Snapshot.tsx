
import { Card, Heading, CardHeader, CardBody, Text, HStack, Spacer, Button, Tag, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useLinodeBackupsQuery } from "../../queries/linodes";
import { Empty } from "../../components/Empty";
import { Indicator } from "../../components/Indicator";
import { backupStatusMap } from "./Automatic";
import { getBackupDisksTotalSize } from "./utils";
import { CaptureSnapshotModal } from "./CaptureSnapshotModal";

interface Props {
  id: number;
}

export function Snapshot({ id }: Props) {
  const { data, isLoading, error } = useLinodeBackupsQuery(id);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error title="Unable to load your Backups" />
  }

  const snapshots = data.snapshot;

  return (
    <Card p={4} pb={8} variant="outline">
      <CardHeader>
        <HStack>
          <Heading size="md">Snapshot</Heading>
          <Spacer />
          <Button onClick={onOpen}>Capture Snapshot</Button>
        </HStack>
        <Text fontSize="sm">You can only have 1 snapshot. Taking a new snapshot will override the previous.</Text>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Label</Th>
                <Th>Created</Th>
                <Th>Status</Th>
                <Th>Disks</Th>
                <Th>Size</Th>
              </Tr>
            </Thead>
            <Tbody>
            {snapshots.in_progress !== null && (
                <Tr>
                  <Td>{snapshots.in_progress.label}</Td>
                  <Td>{snapshots.in_progress.created}</Td>
                  <Td>
                    <HStack>
                      <Indicator color={backupStatusMap[snapshots.in_progress.status]} />
                      <Text textTransform="capitalize">{snapshots.in_progress.status}</Text>
                    </HStack>
                  </Td>
                  <Td>{snapshots.in_progress.disks.map(disk => <Text id={disk.label}>{`${disk.label} - ${disk.size} MB`}</Text>)}</Td>
                  <Td>{getBackupDisksTotalSize(snapshots.in_progress.disks) / 1024} GB</Td>
                </Tr>
              )}
              {snapshots.current !== null && (
                <Tr>
                  <Td>{snapshots.current.label}</Td>
                  <Td>{snapshots.current.created}</Td>
                  <Td>
                    <HStack>
                      <Indicator color={backupStatusMap[snapshots.current.status]} />
                      <Text textTransform="capitalize">{snapshots.current.status}</Text>
                    </HStack>
                  </Td>
                  <Td>{snapshots.current.disks.map(disk => <Text id={disk.label}>{`${disk.label} - ${disk.size} MB`}</Text>)}</Td>
                  <Td>{getBackupDisksTotalSize(snapshots.current.disks) / 1024} GB</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        {!snapshots.current && !snapshots.in_progress && (<Empty title="No Snapshot" />)}
      </CardBody>
      <CaptureSnapshotModal
        linodeId={id}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Card>
  );
}