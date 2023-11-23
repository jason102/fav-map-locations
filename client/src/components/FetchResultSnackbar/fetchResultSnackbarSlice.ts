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
    setIsSnackbarOpen(state, { payload }: PayloadAction<boolean>) {
      state.isSnackbarOpen = payload;
    },
    setFetchResult(state, { payload }: PayloadAction<FetchResult>) {
      state.fetchResult = payload;
    },
  },
});

const { actions, reducer } = fetchResultSnackbarSlice;

export const { setFetchResult, setIsSnackbarOpen } = actions;

export default reducer;
