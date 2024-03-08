import api from ".";
import { UserDetails } from "./types";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserDetails: builder.query<UserDetails, string>({
      query: (username) => ({
        url: `user`,
        params: { username },
      }),
    }),
  }),
});

export const { useGetUserDetailsQuery } = userApi;
