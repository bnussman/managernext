import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Disk, getLinode, getLinodeDisks, getLinodes, getLinodeStats, getLinodeVolumes, Linode, Stats, Volume } from "@linode/api-v4";
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

export const useLinodeStatsQuery = (id: number) => {
  return useQuery<Stats, AxiosError>(
    [queryKey, id, 'stats'],
    () => getLinodeStats(id),
    { refetchInterval: 30000, retryDelay: 10000 }
  );
};

export const useLinodeDisksQuery = (id: number, params?: Params, filter?: any) => {
  return useQuery<ResourcePage<Disk>, AxiosError>(
    [queryKey, id, 'disks', params, filter],
    () => getLinodeDisks(id, params, filter),
    { keepPreviousData: true }
  );
};


export const useLinodeVolumesQuery = (id: number, params?: Params, filter?: any) => {
  return useQuery<ResourcePage<Volume>, AxiosError>(
    [queryKey, id, 'volumes', params, filter],
    () => getLinodeVolumes(id, params, filter),
    { keepPreviousData: true }
  );
};