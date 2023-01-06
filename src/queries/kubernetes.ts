import { deleteNodePool, getKubernetesCluster, getKubernetesClusters, getNodePools, KubeNodePoolResponse, KubernetesCluster, recycleAllNodes, recycleClusterNodes, recycleNode } from "@linode/api-v4";
import { APIError, ResourcePage } from "@linode/api-v4/lib/types";
import { useInfiniteQuery, UseQueryOptions, useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../App";
import { Params } from "../utils/types";

const queryKey = 'kubernetes';

export const useKubernetesClustersQuery = (params?: Params, filter?: any, options?: UseQueryOptions<ResourcePage<KubernetesCluster>, APIError[]>) => {
  return useQuery<ResourcePage<KubernetesCluster>, APIError[]>(
    [queryKey, "paginated", params, filter],
    () => getKubernetesClusters(params, filter),
    { keepPreviousData: true, ...options }
  );
};

export const useKubernetesClusterQuery = (id: number) => {
  return useQuery<KubernetesCluster, APIError[]>(
    [queryKey, id],
    () => getKubernetesCluster(id),
  );
};

export const useInfinateKubernetesClusterSearchQuery = (query: string) => {
  return useInfiniteQuery<ResourcePage<KubernetesCluster>, APIError[]>({
    queryKey: [queryKey, 'search', query],
    queryFn: ({ pageParam }) => getKubernetesClusters({ page: pageParam }, { label: { '+contains': query } }),
    getNextPageParam: ({ page, pages }) => {
      if (page === pages) {
        return undefined;
      }
      return page + 1;
    },
    enabled: query !== ""
  });
};

export const useKubernetesNodePoolsQuery = (clusterId: number, params?: Params, filter?: any) => {
  return useQuery<ResourcePage<KubeNodePoolResponse>, APIError[]>(
    [queryKey, clusterId, "pools", params, filter],
    () => getNodePools(clusterId, params, filter),
    { keepPreviousData: true, refetchInterval: 15 }
  );
};

export const useRecycleNodePoolMutation = (
  clusterId: number,
  poolId: number
) => {
  return useMutation<{}, APIError[]>(() => recycleAllNodes(clusterId, poolId), {
    onSuccess() {
      queryClient.invalidateQueries([queryKey, clusterId, 'pools']);
    },
  });
};

export const useRecycleNodeMutation = (clusterId: number, nodeId: string) => {
  return useMutation<{}, APIError[]>(() => recycleNode(clusterId, nodeId), {
    onSuccess() {
      queryClient.invalidateQueries([queryKey, clusterId, 'pools']);
    },
  });
};

export const useRecycleClusterMutation = (clusterId: number) => {
  return useMutation<{}, APIError[]>(() => recycleClusterNodes(clusterId), {
    onSuccess() {
      queryClient.invalidateQueries([queryKey, clusterId, 'pools']);
    },
  });
};

export const useDeleteNodePoolMutation = (
  clusterId: number,
  poolId: number
) => {
  return useMutation<{}, APIError[]>(() => deleteNodePool(clusterId, poolId), {
    onSuccess() {
      queryClient.invalidateQueries([queryKey, clusterId, 'pools']);
    },
  });
};