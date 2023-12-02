import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "src/app/store";
import { UserDetails } from "src/app/api/types";
// import { LoginFormValues, LoginResponse } from "src/types";
// import { HttpResponseCodes } from "src/utils";

const PUBLIC_ENDPOINTS = ["getAllFavoritedPlaces"];

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

export const { useGetUserDetailsQuery } = apiSlice;

export default apiSlice;
