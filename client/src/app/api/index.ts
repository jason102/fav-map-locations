import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LatLng } from "leaflet";
import { RootState } from "src/app/store";
import { UserDetails } from "src/app/api/types";
import {
  Place,
  PlaceDetails,
  PlaceId,
} from "src/pages/logged-in-pages/Location/types";
// import { HttpResponseCodes } from "src/utils";

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
  // tagTypes: ["Contact"],
  endpoints: (builder) => ({
    getUserDetails: builder.query<UserDetails, string>({
      query: (username) => ({
        url: `/user`,
        params: { username },
      }),
    }),
    // Or maybe this one should take both a LatLng and
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
    // getContacts: builder.query<string, void>({
    //   query: () => "/contacts",
    //   providesTags: ["Contact"],
    // }),
    // addContact: builder.mutation<TransformedResponse, ContactInfo>({
    //   query: (newContact) => ({
    //     url: "/addContact",
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: newContact,
    //   }),
    //   // Include the status code for showing the snackbar
    //   transformResponse: (message: string, meta) => ({
    //     status: meta?.response?.status ?? HttpResponseCodes.TransformError,
    //     message,
    //   }),
    //   invalidatesTags: ["Contact"],
    // }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useGetPlacesNearbyQuery,
  useGetPlaceDetailsQuery,
} = apiSlice;

export default apiSlice;
