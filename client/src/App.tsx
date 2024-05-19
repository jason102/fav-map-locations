import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "src/app/navigation/NavBar";
import FetchResultSnackbar from "src/components/FetchResultSnackbar";
import LoginExpiredDialog from "src/components/LoadingDialog/LoginExpiredDialog";
import { useHealthReport } from "src/app/api/useHealthReport";

const App: React.FC = () => {
  useHealthReport();

  return (
    <>
      <NavBar />
      <Outlet />
      <LoginExpiredDialog />
      <FetchResultSnackbar />
    </>
  );
};

export default App;
