import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "src/app/NavBar";

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default App;
