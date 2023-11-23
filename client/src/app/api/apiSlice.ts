import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ContactInfo, TransformedResponse } from "src/types";
import { HttpResponseCodes } from "src/utils";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  tagTypes: ["Contact"],
  endpoints: (builder) => ({
    getContacts: builder.query<ContactInfo, void>({
      query: () => "/contacts",
      providesTags: ["Contact"],
    }),
    addContact: builder.mutation<TransformedResponse, ContactInfo>({
      query: (newContact) => ({
        url: "/addContact",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newContact,
      }),
      // Include the status code for showing the snackbar
      transformResponse: (message: string, meta) => ({
        status: meta?.response?.status ?? HttpResponseCodes.TransformError,
        message,
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const { useGetContactsQuery, useAddContactMutation } = apiSlice;
