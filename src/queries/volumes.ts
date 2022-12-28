import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getVolumes, Volume } from "@linode/api-v4";
import { AxiosError } from "axios";
import { ResourcePage } from "@linode/api-v4/lib/types";
import { Params } from "../utils/types";

export const queryKey = 'volumes';

export const useVolumesQuery = (params?: Params, filter?: any, options?: UseQueryOptions<ResourcePage<Volume>, AxiosError>) => {
  return useQuery<ResourcePage<Volume>, AxiosError>(
    [queryKey, params, filter],
    () => getVolumes(params, filter),
    { keepPreviousData: true, ...options }
  );
};