import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FetchResult,
  FetchResultType,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";

const logout = createAsyncThunk<any, void>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
        {
          method: "DELETE",
          credentials: "include",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = (await response.json()) as {
        error?: string;
      };

      if (responseData.error) {
        const fetchResult: FetchResult = {
          message: responseData.error,
          type: FetchResultType.error,
        };

        return rejectWithValue(fetchResult);
      }

      return;
    } catch (error) {
      console.log(`logout(): ${error}`);

      const fetchResult: FetchResult = {
        message:
          "Oops, something went wrong! Please contact Jason to get it fixed!",
        type: FetchResultType.error,
      };

      return rejectWithValue(fetchResult);
    }
  }
);

export default logout;
