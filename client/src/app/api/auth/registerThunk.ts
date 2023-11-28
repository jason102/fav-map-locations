import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FetchResult,
  FetchResultType,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { DecodedJWT, RegisterFormValues } from "src/types";
import { trimObjectStringValues } from "src/utils";
import { jwtDecode } from "src/utils/jwtDecode";

const register = createAsyncThunk<
  { decodedJWT: DecodedJWT; accessToken: string },
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

    const decodedJWT = jwtDecode(accessToken);

    return { decodedJWT, accessToken };
  } catch (error) {
    console.log(`register(): ${error}`);

    const fetchResult: FetchResult = {
      message:
        "Oops, something went wrong! Please contact Jason to get it fixed!",
      type: FetchResultType.error,
    };

    return rejectWithValue(fetchResult);
  }
});

export default register;
