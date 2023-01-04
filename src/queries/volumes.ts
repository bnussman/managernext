import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getVolumes, Volume } from "@linode/api-v4";
import { APIError, ResourcePage } from "@linode/api-v4/lib/types";
import { Params } from "../utils/types";

export const queryKey = 'volumes';

export const useVolumesQuery = (params?: Params, filter?: any, options?: UseQueryOptions<ResourcePage<Volume>, APIError[]>) => {
  return useQuery<ResourcePage<Volume>, APIError[]>(
    [queryKey, params, filter],
    () => getVolumes(params, filter),
    { keepPreviousData: true, ...options }
  );
};