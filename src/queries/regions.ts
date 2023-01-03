import { getRegions, Region } from "@linode/api-v4";
import { ResourcePage } from "@linode/api-v4/lib/types";
import { useQuery } from "@tanstack/react-query";

const queryKey = "region";

export const useRegionsQuery = () =>
  useQuery<ResourcePage<Region>>([queryKey], getRegions);