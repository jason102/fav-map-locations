import { LoaderFunctionArgs, Params } from "react-router-dom";
import api from "src/app/api";
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
    endpointQuery: api.endpoints.getUserDetails,
    queryArg: username,
    needsAccess: true,
  });
};
