import { isFetchBaseQueryError, OOPS_MESSAGE } from "src/app/api/apiErrorUtils";
import {
  FetchResult,
  FetchResultType,
  openSnackbarWithFetchResult,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { UseMutationHookReturnType } from "./types";
import { HttpResponseCodes } from "src/utils";
import { useAppDispatch } from "src/app/store";

// "Hides away" all the try/catch and open snackbar logic so we don't have so much of
// this as redundant code in components. Returns the flag isSuccess for use in components.
export const useSnackbarFetchResponse = <T, D = void>(
  [triggerFunction, { isLoading }]: UseMutationHookReturnType,
  httpResponseCodeMessageMap?: {
    [responseCode: number]: FetchResult;
  }
): [
  (payload: T) => Promise<{ isSuccess: boolean; data?: D }>,
  { isLoading: boolean }
] => {
  const dispatch = useAppDispatch();

  const dispatchMutation = async (payload: T) => {
    try {
      const data: D = await triggerFunction(payload).unwrap();

      if (
        httpResponseCodeMessageMap &&
        HttpResponseCodes.Success in httpResponseCodeMessageMap
      ) {
        dispatch(
          openSnackbarWithFetchResult(
            httpResponseCodeMessageMap[HttpResponseCodes.Success]
          )
        );
      }

      return { isSuccess: true, data };
    } catch (error) {
      let loginSessionHasExpired = false;

      if (isFetchBaseQueryError(error)) {
        if (error.status === HttpResponseCodes.AuthTokenExpired) {
          loginSessionHasExpired = true;
        }

        if (httpResponseCodeMessageMap && typeof error.status === "number") {
          const customFetchResult = httpResponseCodeMessageMap[error.status];

          if (customFetchResult !== undefined) {
            dispatch(openSnackbarWithFetchResult(customFetchResult));
            return { isSuccess: false };
          }
        }
      }

      console.error(error);

      if (!loginSessionHasExpired) {
        dispatch(
          openSnackbarWithFetchResult({
            message: OOPS_MESSAGE,
            type: FetchResultType.error,
          })
        );
      }

      return { isSuccess: false };
    }
  };

  return [dispatchMutation, { isLoading }];
};
