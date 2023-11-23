import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const OOPS_MESSAGE =
  "Oops, something went wrong! Please contact Jason to get it fixed!";

// Copied from RTK docs for typing caught errors
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}
