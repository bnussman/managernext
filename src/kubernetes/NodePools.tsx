import { Button, Card, CardBody, CardHeader, Heading, HStack, Spacer, Stack, useDisclosure } from "@chakra-ui/react";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { useKubernetesNodePoolsQuery } from "../queries/kubernetes";
import { NodePool } from "./NodePool";
import { usePagination } from "../utils/usePagination";
import { Pagination } from "../components/Pagination";
import { RecycleKubernetesClusterDialog } from "./RecycleKubernetesClusterDialog";
import { RecycleNodePoolDialog } from "./RecycleNodePoolDialog";
import { RecycleNodeDialog } from "./RecycleNodeDialog";
import { useState } from "react";
import { DeleteNodePoolDialog } from "./DeleteNodePoolDialog";

interface Props {
  clusterId: number;
}

export function NodePools({ clusterId }: Props) {
  const { page, pageSize, handlePageChange, handlePageSizeChange } = usePagination();
  const { data, isLoading, error } = useKubernetesNodePoolsQuery(clusterId, { page, page_size: pageSize });

  const recycleClusterDialog = useDisclosure();
  const recyclePoolDialog = useDisclosure();
  const recycleNodeDialog = useDisclosure();
  const deleteNodePoolDialog = useDisclosure();

  const [selectedPool, setSelectedPool] = useState<number>();
  const [selectedNode, setSelectedNode] = useState<string>();

  const onRecycleNode = (id: string) => {
    setSelectedNode(id);
    recycleNodeDialog.onOpen();
  };

  const onRecyclePool = (id: number) => {
    setSelectedPool(id);
    recyclePoolDialog.onOpen();
  };

  const onDeletePool = (id: number) => {
    setSelectedPool(id);
    deleteNodePoolDialog.onOpen();
  };

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
            <NodePool
              key={pool.id}
              pool={pool}
              clusterId={clusterId}
              onRecycleNode={onRecycleNode}
              onRecyclePool={onRecyclePool}
              onDeletePool={onDeletePool}
            />
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
        clusterId={clusterId}
      />
      <RecycleNodePoolDialog
        isOpen={recyclePoolDialog.isOpen}
        onClose={recyclePoolDialog.onClose}
        clusterId={clusterId}
        nodePoolId={selectedPool}
      />
      <RecycleNodeDialog
        isOpen={recycleNodeDialog.isOpen}
        onClose={recycleNodeDialog.onClose}
        clusterId={clusterId}
        nodeId={selectedNode}
      />
      <DeleteNodePoolDialog
        isOpen={deleteNodePoolDialog.isOpen}
        onClose={deleteNodePoolDialog.onClose}
        clusterId={clusterId}
        nodePoolId={selectedPool}
      />
    </Card>
  );
}