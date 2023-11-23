import {
  MutationTrigger,
  UseMutationStateResult,
} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from "@reduxjs/toolkit/query/react";

export type ContactInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
};

export type TransformedResponse = { status: number; message: string };

// Used for the special case where we're directly passing the apiSlice.useXXXMutation() return value to a custom hook
// This is simply the useXXXMutation() return type but with specific types replaced with 'any' and { isLoading: boolean } added on
export type UseMutationHookReturnType = readonly [
  MutationTrigger<
    MutationDefinition<
      any,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        any,
        FetchBaseQueryMeta
      >,
      string,
      TransformedResponse,
      string
    >
  >,
  UseMutationStateResult<
    MutationDefinition<
      any,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        any,
        FetchBaseQueryMeta
      >,
      string,
      TransformedResponse,
      "api"
    >,
    Record<string, any> & { isLoading: boolean }
  >
];
