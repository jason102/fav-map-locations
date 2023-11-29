import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "src/app/store";

interface Props {
  children: JSX.Element;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { pathname: fromPath } = useLocation();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  return accessToken ? (
    children
  ) : (
    <Navigate to={"/login"} state={{ fromPath }} replace />
  );
};

export default PrivateRoute;
