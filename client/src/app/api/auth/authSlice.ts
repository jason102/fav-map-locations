import { createSlice } from "@reduxjs/toolkit";
import login from "src/app/api/auth/loginThunk";
import register from "src/app/api/auth/registerThunk";
import { UserInfo } from "src/types";

interface AuthState {
  isLoading: boolean;
  accessToken: string;
  userInfo: UserInfo;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  accessToken: "",
  userInfo: { username: "", email: "" },
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
      (state, { payload: { accessToken, userInfo } }) => {
        state.isLoading = false;
        state.accessToken = accessToken;
        state.userInfo = userInfo;
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
      (state, { payload: { accessToken, userInfo } }) => {
        state.isLoading = false;
        state.accessToken = accessToken;
        state.userInfo = userInfo;
      }
    );
    builder.addCase(register.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

const { reducer } = authSlice;

export default reducer;
