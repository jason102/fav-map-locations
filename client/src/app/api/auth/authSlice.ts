import { createSlice } from "@reduxjs/toolkit";
import { login } from "src/app/api/auth/authActions";
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
  },
});

const { reducer } = authSlice;

export default reducer;
