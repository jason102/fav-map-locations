import React from "react";
import { useAppDispatch, useAppSelector } from "src/app/store";

import { setIsSessionExpiredDialogOpen } from "src/app/api/auth/authSlice";
import logout from "src/app/api/auth/logoutThunk";
import {
  FetchResult,
  openSnackbarWithFetchResult,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import LoadingDialog from ".";

const LoginExpiredDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const isSessionExpiredDialogOpen = useAppSelector(
    (state) => state.auth.isSessionExpiredDialogOpen
  );
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  // Note that by clearing the stale access token, this will cause the user to automatically navigate
  // to the /login page via client/src/app/navigation/PrivateRoute.tsx
  const onButtonClick = async () => {
    const {
      meta: { requestStatus },
      payload,
    } = await dispatch(logout());

    if (requestStatus === "rejected") {
      const fetchResult = payload as FetchResult;
      dispatch(openSnackbarWithFetchResult(fetchResult));
    }

    dispatch(setIsSessionExpiredDialogOpen(false));
  };

  return (
    <LoadingDialog
      isOpen={isSessionExpiredDialogOpen}
      isLoading={isLoading}
      onConfirmButtonClick={onButtonClick}
      title="Login Session Expired"
      contentText="Your login session has expired. Please log in again."
    />
  );
};

export default LoginExpiredDialog;
