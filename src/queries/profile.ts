import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getProfile, Profile } from "@linode/api-v4";
import { AxiosError } from "axios";
import { APIError } from "@linode/api-v4/lib/types";
import md5 from 'md5';

export const queryKey = 'profile';

export const useProfile = (options?: UseQueryOptions<Profile, AxiosError<{ errors: APIError[] }>>) => {
  const { data, ...rest } = useQuery<Profile, AxiosError<{ errors: APIError[] }>>([queryKey], getProfile, options);
  return { profile: data, ...rest };
};

export function getGravatar(email: string | undefined) {
  if (!email) {
    return undefined;
  }

  return `https://gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=404`;
}
