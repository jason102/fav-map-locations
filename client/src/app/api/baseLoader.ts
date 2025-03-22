import { ApiEndpointQuery } from "@reduxjs/toolkit/query";
import store from "src/app/store";
import { isFetchBaseQueryError, OOPS_MESSAGE } from "src/app/api/apiErrorUtils";

interface Props {
  endpointQuery: ApiEndpointQuery<any, any>;
  request: Request;
  queryArg?: any;
  needsAccess?: boolean;
}

// Based on this article's ideas for using RTK Query and React Router loaders together:
// https://medium.com/@bitsol/using-react-tool-kit-rtk-query-with-react-router-v6-9eac07521bc5
// https://reactrouter.com/en/main/guides/data-libs
const baseLoader = async ({
  needsAccess,
  endpointQuery,
  request,
  queryArg,
}: Props) => {
  // Using the loader's prefetching ability for faster load times may have to be
  // skipped if RefreshTokensContext is still fetching on app startup. Meaning,
  // let the RTK query hook in the component do the fetching once the access token
  // is available. But as long as a PrivateRoute is not loaded on app startup, the
  // access token should be available and the React Router loader can be used.
  const accessToken = store.getState().auth.accessToken;

  if (!needsAccess || !!accessToken) {
    // Set up the Redux action for fetching the query
    const promise = store.dispatch(endpointQuery.initiate(queryArg));

    // Enable automatic aborting of the query if the user navigates to another
    // route before the query completes
    request.signal.onabort = promise.abort;

    // Fetch the query and get back the same fields that are returned by RTK query hooks
    const { data, isError, error } = await promise;

    if (isError) {
      console.log(`${endpointQuery.name} loader():`, { error });

      if (isFetchBaseQueryError(error)) {
        const { status, data } = error as {
          status?: number;
          data?: { error: string };
        };

        throw new Response("", {
          status,
          statusText: data?.error || OOPS_MESSAGE,
        });
      }

      throw new Response("", {
        status: 403,
        statusText: String(error),
      });
    }

    return data;
  }

  return null;
};

export default baseLoader;
