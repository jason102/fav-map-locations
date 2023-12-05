import React from "react";
import Box from "@mui/material/Box";
import Map from "src/pages/Home/Map";

const Home: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ height: "calc(100vh - 65px)" }}
    >
      <Box>side panel</Box>
      <Map />
    </Box>
  );
};

export default Home;
