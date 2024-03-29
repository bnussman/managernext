import { getRegion, getRegions, Region } from "@linode/api-v4";
import { ResourcePage } from "@linode/api-v4/lib/types";
import { useQuery } from "@tanstack/react-query";

const queryKey = "region";

export const useRegionsQuery = () =>
  useQuery<ResourcePage<Region>>([queryKey], () => getRegions({ page_size: 500 }));

export const useRegionQuery = (id: string, enabled = true) =>
  useQuery<Region>([queryKey, id], () => getRegion(id), { enabled });