import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FetchResult,
  FetchResultType,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { LoginFormValues } from "src/pages/logged-out-pages/types";
import { UserToken } from "./types";
import { trimObjectStringValues } from "src/utils";
import { jwtDecode } from "src/utils/jwtDecode";
import { ApiResponse, SuccessfulResponse } from "src/app/api/types";
import { OOPS_MESSAGE } from "src/app/api/apiErrorUtils";

const login = createAsyncThunk<
  { userToken: UserToken; accessToken: string },
  LoginFormValues
>("auth/login", async (loginFormValues, { rejectWithValue }) => {
  const loginData = trimObjectStringValues<LoginFormValues>(loginFormValues);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        credentials: "include",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
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
    console.log(`login(): ${error}`);

    const fetchResult: FetchResult = {
      message: OOPS_MESSAGE,
      type: FetchResultType.error,
    };

    return rejectWithValue(fetchResult);
  }
});

export default login;
