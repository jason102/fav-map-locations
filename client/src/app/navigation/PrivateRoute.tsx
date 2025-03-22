import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "src/app/store";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { RefreshTokensContext } from "src/app/RefreshTokensContext";

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { pathname: fromPath } = useLocation();
  const { hasRefreshedToken } = useContext(RefreshTokensContext);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  // Loading - waiting for the auth tokens to be refreshed
  if (!hasRefreshedToken) {
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
