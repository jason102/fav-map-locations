import React from "react";
import { Link as RRDLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/store";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";

import logout from "src/app/api/auth/logoutThunk";
import {
  FetchResult,
  FetchResultType,
  openSnackbarWithFetchResult,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import LoadingButton from "src/components/LoadingButton";

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
        openSnackbarWithFetchResult({
          message: "Goodbye! Come again soon!",
          type: FetchResultType.success,
        })
      );
    }

    if (requestStatus === "rejected") {
      const fetchResult = payload as FetchResult;
      dispatch(openSnackbarWithFetchResult(fetchResult));
    }
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
          <LoadingButton isLoading={isLoading} onClick={onLogout}>
            Log out
          </LoadingButton>
        ) : (
          <LoadingButton isLoading={isLoading} component={RRDLink} to={"login"}>
            Log in
          </LoadingButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
