import { LoaderFunctionArgs, Params } from "react-router-dom";
import store from "src/app/store";
import reverseGeocode from "./reverseGeocode";
import { LatLng } from "leaflet";
// import baseLoader from "src/app/api/baseLoader";
// import api from "src/app/api";

interface LoaderArgs extends LoaderFunctionArgs {
  params: Params<"lat" | "lng">;
}

// There are two types of locations: favorited ones and not yet favorited ones.
// If the user clicks on a new place on the map (not yet favorited) and then navigates
// to this page, we already have the OSMPlace for it in redux.
// If the user clicks on an existing favorited place or they directly open this page
// with a valid place ID, we need to use the Google Place API to fetch the OSMPlace.
export default async ({
  params,
}: // request,
LoaderArgs): Promise<void> => {
  const lat = Number(params.lat ?? 0);
  const lng = Number(params.lng ?? 0);

  if (isNaN(lat) || isNaN(lng)) {
    throw new Response("", {
      status: 422,
      statusText:
        "The latitude and longitude parameters in the URL are invalid. Please fix them and load the page again.",
    });
  }

  const existingOSMPlace = store.getState().location.osmPlace;

  let osmPlaceDispatch = undefined;

  if (!existingOSMPlace) {
    osmPlaceDispatch = store.dispatch(reverseGeocode({ lat, lng } as LatLng));
  }

  // TODO: Load any favorited place from our own DB
  // const loadFavoritePlace = baseLoader({
  //   request,
  //   endpointQuery: api.endpoints.getUserDetails,
  //   queryArg: placeId,
  //   needsAccess: true,
  // })

  const [osmPlaceDispatchResult] = await Promise.all([
    osmPlaceDispatch /*, loadFavoritePlace*/,
  ]);

  if (osmPlaceDispatchResult) {
    const {
      meta: { requestStatus },
      payload,
    } = osmPlaceDispatchResult;

    if (requestStatus === "rejected") {
      throw new Response("", {
        status: 422,
        statusText: payload as string,
      });
    }
  }
};
