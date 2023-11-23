import React from "react";
import NavBar from "src/app/NavBar";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default App;
