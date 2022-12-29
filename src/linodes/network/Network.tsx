import { Stack } from "@chakra-ui/react";
import { Loading } from "../../components/Loading";
import { Error } from "../../components/Error";
import { useLinodeIPsQuery } from "../../queries/linodes";
import { IPv4 } from "./IPv4";
import { IPv6 } from "./IPv6";

interface Props {
  id: number;
}

export function Network({ id }: Props) {
  const { isLoading, error } = useLinodeIPsQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error title="Unable to load your Backups" />
  }

  return (
    <Stack spacing={4}>
      <IPv4 id={id} />
      <IPv6 id={id} />
    </Stack>
  );
}