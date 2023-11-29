import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "src/app/store";

interface Props {
  children: JSX.Element;
}

const UnAuthenticatedRoute: React.FC<Props> = ({ children }) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  return accessToken ? <Navigate to={"/"} replace /> : children;
};

export default UnAuthenticatedRoute;
