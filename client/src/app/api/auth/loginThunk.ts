import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FetchResult,
  FetchResultType,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { UserInfo, LoginFormValues } from "src/types";
import { trimObjectStringValues } from "src/utils";
import { jwtDecode } from "src/utils/jwtDecode";

const login = createAsyncThunk<
  { userInfo: UserInfo; accessToken: string },
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

    const userInfo = jwtDecode(accessToken);

    return { userInfo, accessToken };
  } catch (error) {
    console.log(`login(): ${error}`);

    const fetchResult: FetchResult = {
      message:
        "Oops, something went wrong! Please contact Jason to get it fixed!",
      type: FetchResultType.error,
    };

    return rejectWithValue(fetchResult);
  }
});

export default login;
