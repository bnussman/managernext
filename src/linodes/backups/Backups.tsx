import { Card, Text, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Heading, CardHeader, Tag, HStack, Spacer, Stack } from "@chakra-ui/react";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useLinodeBackupsQuery } from "../../queries/linodes";
import { Empty } from "../../components/Empty";
import { Automatic } from "./Automatic";
import { Snapshot } from "./Snapshot";

interface Props {
  id: number;
}

export function Backups({ id }: Props) {
  const { isLoading, error } = useLinodeBackupsQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error title="Unable to load your Backups" />
  }

  return (
    <Stack spacing={4}>
      <Automatic id={id} />
      <Snapshot id={id} />
    </Stack>
  );
}