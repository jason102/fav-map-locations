import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "src/app/store";
import { HttpResponseCodes } from "src/utils";
import { setIsSessionExpiredDialogOpen } from "src/app/api/auth/authSlice";
import refreshToken from "src/app/api/auth/refreshTokenThunk";

const PUBLIC_ENDPOINTS = ["getVisibleAreaPlaces"];

// Helper function for the RTK Query endpoint invalidateTags option:
// https://stackoverflow.com/a/73953650
//
// Only invalidate/trigger other endpoints when the query result is successful
// as this was causing the refresh token endpoint to be called multiple times
// when there was a 403 Forbidden error. (See fetchWithTransformedResponse() refresh
// token logic)
export function invalidateOn<T>({
  success = [],
  error = [],
}: {
  success?: T[];
  error?: T[];
}) {
  return (result: unknown) => (result ? success : error);
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
  prepareHeaders: (headers, { getState, endpoint }) => {
    if (!PUBLIC_ENDPOINTS.includes(endpoint)) {
      const token = (getState() as RootState).auth.accessToken;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
    }

    return headers;
  },
  credentials: "include",
});

export const fetchWithTransformedResponse: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  any,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // For successful responses
  if (result.data && typeof result.data === "object" && "data" in result.data) {
    // Extract the nested data object so there's no need to
    // destructure it from the component hook
    return { ...result, data: result.data.data };
  }

  const loginSessionHasExpired =
    result.error &&
    result.error.status === HttpResponseCodes.AuthTokenExpired &&
    !PUBLIC_ENDPOINTS.includes(api.endpoint);

  if (loginSessionHasExpired) {
    // Try refreshing the access token
    const {
      meta: { requestStatus },
    } = await api.dispatch(refreshToken());

    if (requestStatus === "fulfilled") {
      // Retry the query now with the updated tokens
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Show the dialog for letting the user log back in
      api.dispatch(setIsSessionExpiredDialogOpen(true));
    }
  }

  // Directly return the result for other error cases
  return result;
};

// Base API - see the injected endpoints in their own files:
// client/src/app/api/user.ts
// client/src/app/api/places.ts
// client/src/app/api/photos.ts
const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchWithTransformedResponse,
  endpoints: () => ({}),
});

export default apiSlice;
