import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FetchResult,
  FetchResultType,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { jwtDecode } from "src/utils/jwtDecode";
import { ApiResponse, SuccessfulResponse } from "src/app/api/types";
import { OOPS_MESSAGE } from "src/app/api/apiErrorUtils";
import { UserToken } from "./types";

const refreshToken = createAsyncThunk<
  { userToken: UserToken; accessToken: string },
  void
>("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/refreshToken`,
      {
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

    const { data: accessToken } = responseData as SuccessfulResponse<string>;

    const userToken = jwtDecode(accessToken);

    return { userToken, accessToken };
  } catch (error) {
    console.log(`refreshToken(): ${error}`);

    const fetchResult: FetchResult = {
      message: OOPS_MESSAGE,
      type: FetchResultType.error,
    };

    return rejectWithValue(fetchResult);
  }
});

export default refreshToken;
