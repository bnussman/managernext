import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getLinode, getLinodes, Linode } from "@linode/api-v4";
import { AxiosError } from "axios";
import { ResourcePage } from "@linode/api-v4/lib/types";
import { Params } from "../utils/types";

export const queryKey = 'linode';

export const useLinodesQuery = (params?: Params, filter?: any, options?: UseQueryOptions<ResourcePage<Linode>, AxiosError>) => {
  return useQuery<ResourcePage<Linode>, AxiosError>(
    [queryKey, params, filter],
    () => getLinodes(params, filter),
    { keepPreviousData: true, ...options }
  );
};

export const useLinodeQuery = (id: number) => {
  return useQuery<Linode, AxiosError>(
    [queryKey, id],
    () => getLinode(id),
  );
};