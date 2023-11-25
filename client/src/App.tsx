import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "src/app/NavBar";
import FetchResultSnackbar from "src/components/FetchResultSnackbar";

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <FetchResultSnackbar />
    </>
  );
};

export default App;
