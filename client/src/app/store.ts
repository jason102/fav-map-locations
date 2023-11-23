import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import apiSlice from "src/app/api";
import fetchResultSnackbarReducer from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import authReducer from "src/app/api/auth/authSlice";
import placeReducer from "src/pages/logged-in-pages/Location/placeSlice";
import userLocationReducer from "src/pages/Home/Map/UserLocation/userLocationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    fetchResultSnackbar: fetchResultSnackbarReducer,
    place: placeReducer,
    userLocation: userLocationReducer,
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
