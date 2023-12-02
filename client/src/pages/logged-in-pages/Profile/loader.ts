import { LoaderFunctionArgs, Params } from "react-router-dom";
import api from "src/app/api";
import baseLoader from "src/app/api/baseLoader";

interface LoaderArgs extends LoaderFunctionArgs {
  params: Params<"username">;
}

export default async ({ params, request }: LoaderArgs) => {
  return await baseLoader({
    request,
    endpointQuery: api.endpoints.getUserDetails,
    queryArg: params.username,
    needsAccess: true,
  });
};
