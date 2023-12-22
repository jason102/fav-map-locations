import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "src/app/store";
import { SerializableLatLng, UserDetails } from "src/app/api/types";
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
        const userId = (getState() as RootState).auth.userToken?.userId ?? "";

        if (token) {
          headers.set("authorization", `Bearer ${token}`);
          headers.set("userid", userId);
        }
      }

      return headers;
    },
  }),
  tagTypes: ["Places"],
  endpoints: (builder) => ({
    getUserDetails: builder.query<UserDetails, string>({
      query: (username) => ({
        url: `/user`,
        params: { username },
      }),
    }),
    // TODO: Or maybe this one should take both a LatLng and
    // the paginated max number of places to return?
    getPlacesNearby: builder.query<Place[], SerializableLatLng>({
      query: ({ lat, lng }) => ({
        url: "places/nearby",
        params: {
          lat,
          lng,
        },
      }),
      providesTags: ["Places"],
    }),
    getPlaceDetails: builder.query<PlaceDetails, PlaceId>({
      query: (placeId) => ({
        url: "places/details",
        params: { placeId },
      }),
    }),
    addPlacePhotos: builder.mutation<
      TransformedResponse,
      { filesFormData: FormData; placeId: PlaceId }
    >({
      query: ({ filesFormData, placeId }) => ({
        url: "places/addPhotos",
        method: "POST",
        body: filesFormData,
        params: { placeId },
      }),
    }),
    favoritePlace: builder.mutation<TransformedResponse, Place>({
      query: (place) => ({
        url: "places/addFavorite",
        method: "POST",
        body: { ...place, isFavorited: undefined }, // No need to send isFavorited
      }),
      onQueryStarted: (place, { dispatch, queryFulfilled }) => {
        const dispatchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getPlacesNearby",
            { lat: place.lat, lng: place.lng },
            (draft) => {
              draft.push(place);
            }
          )
        );

        queryFulfilled.catch(dispatchResult.undo);
      },
      invalidatesTags: ["Places"],
    }),
    removeFavoritePlace: builder.mutation<TransformedResponse, PlaceId>({
      query: (placeId) => ({
        url: "places/removeFavorite",
        method: "DELETE",
        body: placeId,
      }),
      invalidatesTags: ["Places"],
    }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useGetPlacesNearbyQuery,
  useGetPlaceDetailsQuery,
  useFavoritePlaceMutation,
  useRemoveFavoritePlaceMutation,
  useAddPlacePhotosMutation,
} = apiSlice;

export default apiSlice;
