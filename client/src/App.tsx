import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "src/app/navigation/NavBar";
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
