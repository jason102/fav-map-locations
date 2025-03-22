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
import { SuccessMessageResponse } from "src/app/api/types";

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
      SuccessMessageResponse | any,
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
      SuccessMessageResponse | any,
      "api"
    >,
    Record<string, any> & { isLoading: boolean }
  >
];
