import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FetchResult,
  FetchResultType,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { RegisterFormValues } from "src/pages/logged-out-pages/types";
import { UserToken } from "./types";
import { trimObjectStringValues } from "src/utils";
import { jwtDecode } from "src/utils/jwtDecode";
import { ApiResponse, SuccessfulResponse } from "src/app/api/types";
import { OOPS_MESSAGE } from "src/app/api/apiErrorUtils";

const register = createAsyncThunk<
  { userToken: UserToken; accessToken: string },
  RegisterFormValues
>("auth/register", async (registerFormValues, { rejectWithValue }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { repeatedPassword, ...formValuesWithoutRepeatedPassword } =
    registerFormValues;

  const registrationData = trimObjectStringValues<
    Omit<RegisterFormValues, "repeatedPassword">
  >(formValuesWithoutRepeatedPassword);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
      {
        method: "POST",
        credentials: "include",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
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
    console.log(`register(): ${error}`);

    const fetchResult: FetchResult = {
      message: OOPS_MESSAGE,
      type: FetchResultType.error,
    };

    return rejectWithValue(fetchResult);
  }
});

export default register;
