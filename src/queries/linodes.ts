import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Config, Disk, getLinode, getLinodeBackups, getLinodeConfigs, getLinodeDisks, getLinodeIPs, getLinodes, getLinodeStats, getLinodeVolumes, Linode, LinodeBackup, LinodeBackupsResponse, linodeBoot, LinodeIPsResponse, linodeShutdown, Stats, takeSnapshot, updateLinode, Volume } from "@linode/api-v4";
import { AxiosError } from "axios";
import { ResourcePage } from "@linode/api-v4/lib/types";
import { Params } from "../utils/types";
import { queryClient } from "../App";

export const queryKey = 'linode';

export const useLinodesQuery = (params?: Params, filter?: any, options?: UseQueryOptions<ResourcePage<Linode>, AxiosError>) => {
  return useQuery<ResourcePage<Linode>, AxiosError>(
    [queryKey, "paginated", params, filter],
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

export const useLinodeConfigsQuery = (id: number, params?: Params, filter?: any) => {
  return useQuery<ResourcePage<Config>, AxiosError>(
    [queryKey, id, 'configs', params, filter],
    () => getLinodeConfigs(id, params, filter),
    { keepPreviousData: true }
  );
};

export const useLinodeBackupsQuery = (id: number) => {
  return useQuery<LinodeBackupsResponse, AxiosError>(
    [queryKey, id, 'backups'],
    () => getLinodeBackups(id)
  );
};

export const useLinodeIPsQuery = (id: number) => {
  return useQuery<LinodeIPsResponse, AxiosError>(
    [queryKey, id, 'ips'],
    () => getLinodeIPs(id)
  );
};

export const useCaptureSnapshotMutation = (id: number) => {
  return useMutation<LinodeBackup, AxiosError, { label: string }>(
    ({ label }) => takeSnapshot(id, label),
    {
      onSuccess(data) {
        queryClient.setQueryData<LinodeBackupsResponse>([queryKey, id, 'backups'], (oldData) => {
          if (oldData === undefined) {
            return undefined;
          }

          return {
            automatic: oldData.automatic,
            snapshot: {
              current: oldData.snapshot.current,
              in_progress: data
            }
          };
        });
      },
    }
  );
};

export const useLinodeMutation = (id: number) => {
  return useMutation<Linode, AxiosError, Partial<Linode>>(
    (data) => updateLinode(id, data),
    {
      onSuccess(data) {
        queryClient.setQueryData<Linode>([queryKey, id], data);
        queryClient.invalidateQueries([queryKey, "paginated"]);
      }
    }
  );
};


export const useLinodeShutdownMutation = (id: number) => {
  return useMutation<{}, AxiosError>(
    () => linodeShutdown(id),
    {
      onSuccess() {
        queryClient.invalidateQueries([queryKey, "paginated"]);
        queryClient.setQueryData<Linode>([queryKey, id], (oldData) => {
          if (oldData === undefined) {
            return undefined;
          }

          return { ...oldData, status: 'shutting_down' };
        });
      },
    }
  );
};

export const useLinodeBootMutation = (id: number) => {
  return useMutation<{}, AxiosError>(
    () => linodeBoot(id),
    {
      onSuccess() {
        queryClient.invalidateQueries([queryKey, "paginated"]);
        queryClient.setQueryData<Linode>([queryKey, id], (oldData) => {
          if (oldData === undefined) {
            return undefined;
          }

          return { ...oldData, status: 'booting' };
        });
      },
    }
  );
};
