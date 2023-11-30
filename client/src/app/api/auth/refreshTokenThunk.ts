import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FetchResult,
  FetchResultType,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { jwtDecode } from "src/utils/jwtDecode";

const refreshToken = createAsyncThunk<any, void>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/refreshToken`,
        {
          credentials: "include",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = (await response.json()) as {
        error?: string;
        accessToken: string;
      };

      if (responseData.error) {
        const fetchResult: FetchResult = {
          message: responseData.error,
          type: FetchResultType.error,
        };

        return rejectWithValue(fetchResult);
      }

      const { accessToken } = responseData;

      const userToken = jwtDecode(accessToken);

      return { userToken, accessToken };
    } catch (error) {
      console.log(`refreshToken(): ${error}`);

      const fetchResult: FetchResult = {
        message:
          "Oops, something went wrong! Please contact Jason to get it fixed!",
        type: FetchResultType.error,
      };

      return rejectWithValue(fetchResult);
    }
  }
);

export default refreshToken;
