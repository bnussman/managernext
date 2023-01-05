import { getKubernetesClusters, KubernetesCluster } from "@linode/api-v4";
import { APIError, ResourcePage } from "@linode/api-v4/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const queryKey = 'kubernetes';

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