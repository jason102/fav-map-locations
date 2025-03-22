import { LoaderFunctionArgs, Params } from "react-router-dom";
import { PlaceId } from "./types";
import baseLoader from "src/app/api/baseLoader";
import { placesApi } from "src/app/api/places";

interface LoaderArgs extends LoaderFunctionArgs {
  params: Params<"placeId">;
}

export default async ({ params, request }: LoaderArgs) => {
  const placeId: PlaceId | undefined = params.placeId;

  if (!placeId) {
    throw new Response("", {
      status: 422,
      statusText:
        "Invalid place ID. Please try fixing the URL and loading the page again.",
    });
  }

  return await baseLoader({
    request,
    endpointQuery: placesApi.endpoints.getPlaceDetails,
    queryArg: placeId,
    needsAccess: true,
  });
};
