import { createSlice } from "@reduxjs/toolkit";
import login from "src/app/api/auth/loginThunk";
import register from "src/app/api/auth/registerThunk";
import { DecodedJWT } from "src/types";

interface AuthState {
  isLoading: boolean;
  accessToken: string;
  decodedJWT: DecodedJWT;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  accessToken: "",
  decodedJWT: { username: "", id: "", email: "" },
  registerSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      login.fulfilled,
      (state, { payload: { accessToken, decodedJWT } }) => {
        state.isLoading = false;
        state.accessToken = accessToken;
        state.decodedJWT = decodedJWT;
      }
    );
    builder.addCase(login.rejected, (state) => {
      state.isLoading = false;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      register.fulfilled,
      (state, { payload: { accessToken, decodedJWT } }) => {
        state.isLoading = false;
        state.accessToken = accessToken;
        state.decodedJWT = decodedJWT;
      }
    );
    builder.addCase(register.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

const { reducer } = authSlice;

export default reducer;
