import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/store";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import refreshToken from "src/app/api/auth/refreshTokenThunk";

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { pathname: fromPath } = useLocation();

  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isFetchingAccessToken = useAppSelector((state) => state.auth.isLoading);

  const [hasRefreshedToken, setHasRefreshedToken] = useState(!!accessToken);

  useEffect(() => {
    const getRefreshedAccessToken = async () => {
      await dispatch(refreshToken());

      setHasRefreshedToken(true);
    };

    if (!accessToken) {
      getRefreshedAccessToken();
    }
  }, [accessToken, dispatch]);

  // Loading - waiting for the auth tokens to be refreshed
  if (!hasRefreshedToken || isFetchingAccessToken) {
    return (
      <Box display="flex" justifyContent="center" pt={15}>
        <CircularProgress size={30} color="inherit" />
      </Box>
    );
  }

  return accessToken ? (
    children
  ) : (
    <Navigate to={"/login"} state={{ fromPath }} replace />
  );
};

export default PrivateRoute;
