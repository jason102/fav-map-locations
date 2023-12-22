import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import apiSlice from "src/app/api";
import fetchResultSnackbarReducer from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import authReducer from "src/app/api/auth/authSlice";
import locationReducer from "src/pages/logged-in-pages/Location/locationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    fetchResultSnackbar: fetchResultSnackbarReducer,
    location: locationReducer,
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
