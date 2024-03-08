import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const OOPS_MESSAGE =
  "Oops, something went wrong! Please contact Jason to get it fixed!";

// Copied from RTK docs for typing caught errors
// https://redux-toolkit.js.org/rtk-query/usage-with-typescript#inline-error-handling-example
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}
