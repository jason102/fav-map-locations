import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// This is aligned with all the severity types of @mui/material/Alert
export enum FetchResultType {
  error = "error",
  warning = "warning",
  info = "info",
  success = "success",
}

export type FetchResult = {
  message: string;
  type: FetchResultType;
};

interface FetchResultSnackbarState {
  fetchResult: FetchResult;
  isSnackbarOpen: boolean;
}

const initialState: FetchResultSnackbarState = {
  fetchResult: {
    message: "",
    type: FetchResultType.info,
  },
  isSnackbarOpen: false,
};

const fetchResultSnackbarSlice = createSlice({
  name: "fetchResultSnackbar",
  initialState,
  reducers: {
    closeSnackbar(state) {
      state.isSnackbarOpen = false;
    },
    openSnackbarWithFetchResult(
      state,
      { payload }: PayloadAction<FetchResult>
    ) {
      state.fetchResult = payload;
      state.isSnackbarOpen = true;
    },
  },
});

const { actions, reducer } = fetchResultSnackbarSlice;

export const { openSnackbarWithFetchResult, closeSnackbar } = actions;

export default reducer;
