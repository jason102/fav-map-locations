import { createSlice } from "@reduxjs/toolkit";
import login from "src/app/api/auth/loginThunk";
import register from "src/app/api/auth/registerThunk";
import logout from "src/app/api/auth/logoutThunk";
import refreshToken from "src/app/api/auth/refreshTokenThunk";
import { UserToken } from "./types";

interface AuthState {
  isLoading: boolean;
  accessToken: string;
  userToken: UserToken | null;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  accessToken: "",
  userToken: null,
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
      (state, { payload: { accessToken, userToken } }) => {
        state.isLoading = false;
        state.accessToken = accessToken;
        state.userToken = userToken;
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
      (state, { payload: { accessToken, userToken } }) => {
        state.isLoading = false;
        state.accessToken = accessToken;
        state.userToken = userToken;
      }
    );
    builder.addCase(register.rejected, (state) => {
      state.isLoading = false;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.accessToken = "";
      state.userToken = null;
    });
    builder.addCase(logout.rejected, (state) => {
      state.isLoading = false;
    });

    // Refresh token
    builder.addCase(refreshToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      refreshToken.fulfilled,
      (state, { payload: { accessToken, userToken } }) => {
        state.isLoading = false;
        state.accessToken = accessToken;
        state.userToken = userToken;
      }
    );
    builder.addCase(refreshToken.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

const { reducer } = authSlice;

export default reducer;
