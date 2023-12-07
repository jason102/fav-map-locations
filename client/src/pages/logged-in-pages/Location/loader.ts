import { LoaderFunctionArgs, Params } from "react-router-dom";
import { LocationLoaderData } from "./types";
import store from "src/app/store";
import getGooglePlace, {
  GoogleError,
} from "src/pages/logged-in-pages/Location/getGooglePlaceThunk";
// import baseLoader from "src/app/api/baseLoader";
// import api from "src/app/api";

interface LoaderArgs extends LoaderFunctionArgs {
  params: Params<"googlePlaceID">;
}

// There are two types of locations: favorited ones and not yet favorited ones.
// If the user clicks on a new place on the map (not yet favorited) and then navigates
// to this page, we already have the GooglePlace for it in redux.
// If the user clicks on an existing favorited place or they directly open this page
// with a valid place ID, we need to use the Google Place API to fetch the GooglePlace.
export default async ({
  params,
}: // request,
LoaderArgs): Promise<LocationLoaderData> => {
  const placeId = params.googlePlaceID ?? "";

  const existingGooglePlace = store.getState().location.selectedGooglePlace;

  let googlePlaceDispatch = undefined;

  if (!existingGooglePlace) {
    googlePlaceDispatch = store.dispatch(getGooglePlace({ placeId }));
  }

  // TODO: Load any favorited place from our own DB
  // const loadFavoritePlace = baseLoader({
  //   request,
  //   endpointQuery: api.endpoints.getUserDetails,
  //   queryArg: placeId,
  //   needsAccess: true,
  // })

  const [googlePlaceDispatchResult] = await Promise.all([
    googlePlaceDispatch /*, loadFavoritePlace*/,
  ]);

  if (googlePlaceDispatchResult) {
    const {
      meta: { requestStatus },
      payload,
    } = googlePlaceDispatchResult;

    if (requestStatus === "rejected") {
      throw new Response("", {
        status: 422,
        statusText:
          payload === GoogleError.invalidPlace
            ? "Sorry, we couldn't find this location :("
            : (payload as string),
      });
    }
  }

  return { googlePlaceID: placeId };
};
