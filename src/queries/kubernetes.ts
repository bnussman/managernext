import { getKubernetesCluster, getKubernetesClusters, getNodePools, KubeNodePoolResponse, KubernetesCluster } from "@linode/api-v4";
import { APIError, ResourcePage } from "@linode/api-v4/lib/types";
import { useInfiniteQuery, UseQueryOptions, useQuery } from "@tanstack/react-query";
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

export const useKubernetesNodePoolsQuery = (id: number, params?: Params, filter?: any) => {
  return useQuery<ResourcePage<KubeNodePoolResponse>, APIError[]>(
    [queryKey, "paginated", params, filter],
    () => getNodePools(id, params, filter),
    { keepPreviousData: true }
  );
};