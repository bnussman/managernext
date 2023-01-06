import { Button, Card, CardBody, CardFooter, CardHeader, Heading, HStack, Spacer, Stack, useDisclosure } from "@chakra-ui/react";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { useKubernetesNodePoolsQuery } from "../queries/kubernetes";
import { NodePool } from "./NodePool";
import { usePagination } from "../utils/usePagination";
import { Pagination } from "../components/Pagination";
import { RecycleKubernetesClusterDialog } from "./RecycleKubernetesClusterDialog";

interface Props {
  clusterId: number;
}

export function NodePools({ clusterId }: Props) {
  const { page, pageSize, handlePageChange, handlePageSizeChange } = usePagination();
  const { data, isLoading, error } = useKubernetesNodePoolsQuery(clusterId, { page, page_size: pageSize });

  const recycleClusterDialog = useDisclosure();

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Unable to load your node pools" />
  }

  return (
    <Card variant="outline">
      <CardHeader>
        <HStack>
          <Heading size="md">Node Pools</Heading>
          <Spacer />
          <HStack>
            <Button onClick={recycleClusterDialog.onOpen}>Recycle</Button>
            <Button>Add Node Pool</Button>
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          {data.data.map((pool) => (
            <NodePool key={pool.id} {...pool} />
          ))}
          <Pagination
            page={page}
            pageSize={pageSize}
            setPage={handlePageChange}
            setPageSize={handlePageSizeChange}
            results={data.results}
            type="pools"
          />
        </Stack>
      </CardBody>
      <RecycleKubernetesClusterDialog
        isOpen={recycleClusterDialog.isOpen}
        onClose={recycleClusterDialog.onClose}
      />
    </Card>
  );
}