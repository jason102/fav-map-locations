import api from ".";
import { UserDetails } from "./types";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserDetails: builder.query<UserDetails, string>({
      query: (username) => ({
        url: `graphql`,
        method: "POST",
        body: {
          query: `
            query GetUserDetails($username: String) {
              userDetails(username: $username) {
                email
              }
            }
          `,
          variables: { username },
        },
      }),
    }),
  }),
});

export const { useGetUserDetailsQuery } = userApi;
