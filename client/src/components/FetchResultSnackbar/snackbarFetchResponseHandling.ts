import {
  isErrorWithMessage,
  isFetchBaseQueryError,
} from "src/app/api/createApiErrorUtils";
import {
  FetchResult,
  FetchResultType,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { UseMutationHookReturnType } from "./types";
import { HttpResponseCodes } from "src/utils";

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
      const { message } = await triggerFunction(payload).unwrap();

      if (
        httpResponseCodeMessageMap &&
        HttpResponseCodes.Success in httpResponseCodeMessageMap
      ) {
        return httpResponseCodeMessageMap[HttpResponseCodes.Success];
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

        let errorMessage = "Unknown error";

        if ("error" in error) {
          errorMessage = error.error;
        }

        if (
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data
        ) {
          errorMessage = error.data.message as string;
        }

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
