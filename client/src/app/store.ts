import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { apiSlice } from "src/app/api/apiSlice";
import fetchResultSnackbarReducer from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import authReducer from "src/app/api/auth/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    fetchResultSnackbar: fetchResultSnackbarReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
