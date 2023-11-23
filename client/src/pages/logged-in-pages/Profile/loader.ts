import { LoaderFunctionArgs, Params } from "react-router-dom";
import { userApi } from "src/app/api/user";
import baseLoader from "src/app/api/baseLoader";

interface LoaderArgs extends LoaderFunctionArgs {
  params: Params<"username">;
}

export default async ({ params, request }: LoaderArgs) => {
  const username = params.username;

  if (!username) {
    throw new Response("", {
      status: 422,
      statusText:
        "Invalid username. Please try fixing the URL and loading the page again.",
    });
  }

  return await baseLoader({
    request,
    endpointQuery: userApi.endpoints.getUserDetails,
    queryArg: username,
    needsAccess: true,
  });
};
