import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "src/app/store";
import { closeSnackbar } from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";

const FetchResultSnackbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const isSnackbarOpen = useAppSelector(
    (state) => state.fetchResultSnackbar.isSnackbarOpen
  );
  const fetchResult = useAppSelector(
    (state) => state.fetchResultSnackbar.fetchResult
  );

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={isSnackbarOpen}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={fetchResult.type}
        elevation={6}
        sx={{ width: "100%" }}
      >
        {fetchResult.message}
      </Alert>
    </Snackbar>
  );
};

export default FetchResultSnackbar;
