import { APIError } from "@linode/api-v4/lib/types";
import { AxiosError } from "axios";

export function getErrorFor(field: string, error?: APIError[] | null): string | null {
  if (!error) {
    return null;
  }

  const fieldError = error.find(e => e.field === field);

  return fieldError?.reason ?? null;
}

export function hasErrorFor(field: string, error?: APIError[] | null): boolean {
  if (!error) {
    return false;
  }

  const fieldError = error.find(e => e.field === field);

  return fieldError !== undefined;
}

export const normalizeErrors = (error: AxiosError<{ errors: APIError[] }>) => {
  const errors: APIError[] = error.response?.data?.errors ?? [
    { reason: "Unknown Error" },
  ];
  return Promise.reject(errors);
};