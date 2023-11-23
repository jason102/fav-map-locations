import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  FetchResult,
  FetchResultType,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { UseMutationHookReturnType } from "src/types";

// Copied from RTK docs for typing caught errors
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as any).message === "string"
  );
}

// Returns a FetchResultSnackbar FetchResult so the snackbar shows the correct information based on the
// triggerFunction API response data
export const useSnackbarFetchResponse = <T>(
  [triggerFunction, { isLoading }]: UseMutationHookReturnType,
  httpResponseCodeMessageMap?: {
    [responseCode: number]: FetchResult;
  }
): [(payload: T) => Promise<FetchResult>, { isLoading: boolean }] => {
  const dispatchMutation = async (payload: T): Promise<FetchResult> => {
    try {
      const { message, status } = await triggerFunction(payload).unwrap();

      if (httpResponseCodeMessageMap) {
        const customFetchResult = httpResponseCodeMessageMap[status];

        if (customFetchResult !== undefined) {
          return customFetchResult;
        }
      }

      return {
        message,
        type: FetchResultType.success,
      };
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        if (httpResponseCodeMessageMap && typeof error.status === "number") {
          const customFetchResult = httpResponseCodeMessageMap[error.status];

          if (customFetchResult !== undefined) {
            return customFetchResult;
          }
        }

        const errorMessage =
          "error" in error ? (error.error as string) : (error.data as string);

        return {
          message: errorMessage,
          type: FetchResultType.error,
        };
      }

      if (isErrorWithMessage(error)) {
        return {
          message: error.message,
          type: FetchResultType.error,
        };
      }

      return {
        message: `Error: ${String(error)}`,
        type: FetchResultType.error,
      };
    }
  };

  return [dispatchMutation, { isLoading }];
};
