import { APIError, Filter, NodeBalancer, NodeBalancerStats, Params, ResourcePage, getNodeBalancer, getNodeBalancerStats, getNodeBalancers } from "@linode/api-v4";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

const queryKey = 'nodebalancers';

export const useNodeBalancersQuery = (params?: Params, filter?: Filter, options?: UseQueryOptions<ResourcePage<NodeBalancer>, APIError[]>) => {
  return useQuery<ResourcePage<NodeBalancer>, APIError[]>(
    [queryKey, "paginated", params, filter],
    () => getNodeBalancers(params, filter),
    { keepPreviousData: true, ...options }
  );
};

export const useNodeBalancerQuery = (id: number) => {
  return useQuery<NodeBalancer, APIError[]>(
    [queryKey, "nodebalancer", id],
    () => getNodeBalancer(id),
  );
};

export const useNodeBalancerStatsQuery = (id: number) => {
  return useQuery<NodeBalancerStats, APIError[]>(
    [queryKey, "nodebalancer", id, 'stats'],
    () => getNodeBalancerStats(id),
  );
};