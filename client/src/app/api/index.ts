import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LatLng } from "leaflet";
import { RootState } from "src/app/store";
import { UserDetails } from "src/app/api/types";
import {
  Place,
  PlaceDetails,
  PlaceId,
} from "src/pages/logged-in-pages/Location/types";
import { TransformedResponse } from "src/components/FetchResultSnackbar/types";

const PUBLIC_ENDPOINTS = ["getPlacesNearby"];

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
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
  }),
  endpoints: (builder) => ({
    getUserDetails: builder.query<UserDetails, string>({
      query: (username) => ({
        url: `/user`,
        params: { username },
      }),
    }),
    // TODO: Or maybe this one should take both a LatLng and
    // the paginated max number of places to return?
    getPlacesNearby: builder.query<Place[], LatLng>({
      query: ({ lat, lng }) => ({
        url: "/placesNearby",
        params: {
          lat,
          lng,
        },
      }),
    }),
    getPlaceDetails: builder.query<PlaceDetails, PlaceId>({
      query: (placeId) => ({
        url: "/placeDetails",
        params: { placeId },
      }),
    }),
    favoritePlace: builder.mutation<TransformedResponse, Place>({
      query: (place) => ({
        url: "/favoritePlace",
        method: "POST",
        body: place,
      }),
      onQueryStarted: (place, { dispatch, queryFulfilled }) => {
        const dispatchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getPlacesNearby",
            new LatLng(place.lat, place.lng),
            (draft) => {
              draft.push(place);
            }
          )
        );

        queryFulfilled.catch(dispatchResult.undo);
      },
    }),
    removeFavoritePlace: builder.mutation<TransformedResponse, PlaceId>({
      query: (placeId) => ({
        url: "/removeFavoritePlace",
        method: "DELETE",
        body: placeId,
      }),
    }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useGetPlacesNearbyQuery,
  useGetPlaceDetailsQuery,
  useFavoritePlaceMutation,
  useRemoveFavoritePlaceMutation,
} = apiSlice;

export default apiSlice;
