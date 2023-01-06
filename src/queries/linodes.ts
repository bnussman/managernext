import { useInfiniteQuery, useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Config, createLinode, CreateLinodeRequest, Disk, getLinode, getLinodeBackups, getLinodeConfigs, getLinodeDisks, getLinodeIPs, getLinodes, getLinodeStats, getLinodeTypes, getLinodeVolumes, Linode, LinodeBackup, LinodeBackupsResponse, linodeBoot, LinodeIPsResponse, linodeReboot, linodeShutdown, LinodeType, Stats, takeSnapshot, updateLinode, Volume } from "@linode/api-v4";
import { APIError, ResourcePage } from "@linode/api-v4/lib/types";
import { Params } from "../utils/types";
import { queryClient } from "../App";

export const queryKey = 'linode';

export const useLinodesQuery = (params?: Params, filter?: any, options?: UseQueryOptions<ResourcePage<Linode>, APIError[]>) => {
  return useQuery<ResourcePage<Linode>, APIError[]>(
    [queryKey, "paginated", params, filter],
    () => getLinodes(params, filter),
    { keepPreviousData: true, ...options }
  );
};

export const useLinodeTypesQuery = (params: Params = { page_size: 500 }) => {
  return useQuery<ResourcePage<LinodeType>, APIError[]>(
    [queryKey, "types"],
    () => getLinodeTypes(params),
  );
};

export const useLinodeQuery = (id: number) => {
  return useQuery<Linode, APIError[]>(
    [queryKey, id],
    () => getLinode(id),
  );
};

export const useLinodeStatsQuery = (id: number) => {
  return useQuery<Stats, APIError[]>(
    [queryKey, id, 'stats'],
    () => getLinodeStats(id),
    { refetchInterval: 30000, retryDelay: 10000 }
  );
};

export const useLinodeDisksQuery = (id: number, params?: Params, filter?: any) => {
  return useQuery<ResourcePage<Disk>, APIError[]>(
    [queryKey, id, 'disks', params, filter],
    () => getLinodeDisks(id, params, filter),
    { keepPreviousData: true }
  );
};


export const useLinodeVolumesQuery = (id: number, params?: Params, filter?: any) => {
  return useQuery<ResourcePage<Volume>, APIError[]>(
    [queryKey, id, 'volumes', params, filter],
    () => getLinodeVolumes(id, params, filter),
    { keepPreviousData: true }
  );
};

export const useLinodeConfigsQuery = (id: number, params?: Params, filter?: any) => {
  return useQuery<ResourcePage<Config>, APIError[]>(
    [queryKey, id, 'configs', params, filter],
    () => getLinodeConfigs(id, params, filter),
    { keepPreviousData: true }
  );
};

export const useLinodeBackupsQuery = (id: number) => {
  return useQuery<LinodeBackupsResponse, APIError[]>(
    [queryKey, id, 'backups'],
    () => getLinodeBackups(id)
  );
};

export const useLinodeIPsQuery = (id: number) => {
  return useQuery<LinodeIPsResponse, APIError[]>(
    [queryKey, id, 'ips'],
    () => getLinodeIPs(id)
  );
};

export const useCaptureSnapshotMutation = (id: number) => {
  return useMutation<LinodeBackup, APIError[], { label: string }>(
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
  return useMutation<Linode, APIError[], Partial<Linode>>(
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
  return useMutation<{}, APIError[]>(
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
  return useMutation<{}, APIError[]>(
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

export const useLinodeRebootMutation = (id: number) => {
  return useMutation<{}, APIError[]>(
    () => linodeReboot(id),
    {
      onSuccess() {
        queryClient.invalidateQueries([queryKey, "paginated"]);
        queryClient.setQueryData<Linode>([queryKey, id], (oldData) => {
          if (oldData === undefined) {
            return undefined;
          }

          return { ...oldData, status: 'rebooting' };
        });
      },
    }
  );
};

export const useCreateLinodeMutation = () => {
  return useMutation<Linode, APIError[], CreateLinodeRequest>(
    createLinode,
    {
      onSuccess(linode) {
        queryClient.invalidateQueries([queryKey, "paginated"]);
        queryClient.setQueryData<Linode>([queryKey, linode.id], linode);
      },
    }
  );
};

export const useInfinateLinodesSearchQuery = (query: string) => {
  return useInfiniteQuery<ResourcePage<Linode>, APIError[]>({
    queryKey: [queryKey, 'search', query],
    queryFn: ({ pageParam }) => getLinodes(
      { page: pageParam },
      {
        '+or': [
          { id: query },
          { label: { '+contains': query } },
          { ipv4: { '+contains': query } },
          { tags: { '+contains': query } },
        ],
      }
    ),
    getNextPageParam: ({ page, pages }) => {
      if (page === pages) {
        return undefined;
      }
      return page + 1;
    },
    enabled: query !== ""
  });
};