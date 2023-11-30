import React from "react";
import { Link as RRDLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/store";

import AppBar from "@mui/material/AppBar/AppBar";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import Link from "@mui/material/Link/Link";
import Button from "@mui/material/Button/Button";
import CircularProgress from "@mui/material/CircularProgress";

import logout from "src/app/api/auth/logoutThunk";
import {
  FetchResult,
  FetchResultType,
  setFetchResult,
  setIsSnackbarOpen,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";

const NavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const userToken = useAppSelector((state) => state.auth.userToken);

  const onLogout = async () => {
    const {
      meta: { requestStatus },
      payload,
    } = await dispatch(logout());

    if (requestStatus === "fulfilled") {
      dispatch(
        setFetchResult({
          message: "Goodbye! Come again soon!",
          type: FetchResultType.success,
        })
      );
    }

    if (requestStatus === "rejected") {
      const fetchResult = payload as FetchResult;
      dispatch(setFetchResult(fetchResult));
    }

    dispatch(setIsSnackbarOpen(true));
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={5}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Link
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
          component={RRDLink}
          to={"/"}
          underline="none"
        >
          Favorite Map Locations!
        </Link>
        <nav>
          <Link
            variant="button"
            color="text.primary"
            sx={{ my: 1, mx: 1.5 }}
            component={RRDLink}
            to={"about"}
          >
            About
          </Link>
          {accessToken && (
            <Link
              variant="button"
              color="text.primary"
              sx={{ my: 1, mx: 1.5 }}
              component={RRDLink}
              to={`profile/${userToken!.username}`}
            >
              My Profile
            </Link>
          )}
        </nav>
        {accessToken ? (
          <Button
            variant="contained"
            sx={{ my: 1, mx: 1.5 }}
            onClick={onLogout}
            disabled={isLoading}
            {...(isLoading && { sx: { width: "88px", height: "36px" } })}
          >
            {isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Log out"
            )}
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{ my: 1, mx: 1.5 }}
            component={RRDLink}
            to={"login"}
            disabled={isLoading}
            {...(isLoading && { sx: { width: "88px", height: "36px" } })}
          >
            {isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Log in"
            )}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
