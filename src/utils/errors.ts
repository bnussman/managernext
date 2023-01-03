import { APIError } from "@linode/api-v4/lib/types";

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