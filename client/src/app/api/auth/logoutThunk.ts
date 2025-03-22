import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FetchResult,
  FetchResultType,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
// import api from "src/app/api/index";
import { ApiResponse } from "src/app/api/types";
import { OOPS_MESSAGE } from "src/app/api/apiErrorUtils";

const logout = createAsyncThunk<any, void>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
        {
          method: "DELETE",
          credentials: "include",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData: ApiResponse<string> = await response.json();

      if (responseData.error) {
        const fetchResult: FetchResult = {
          message: responseData.error,
          type: FetchResultType.error,
        };

        return rejectWithValue(fetchResult);
      }

      // TODO: Clear some of createApi()'s cache so some user-specific data is not carried over to a different user
      // if another user later logs in without reloading the app

      return;
    } catch (error) {
      console.log(`logout(): ${error}`);

      const fetchResult: FetchResult = {
        message: OOPS_MESSAGE,
        type: FetchResultType.error,
      };

      return rejectWithValue(fetchResult);
    }
  }
);

export default logout;
