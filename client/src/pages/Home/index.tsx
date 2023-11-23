import React from "react";
import Box from "@mui/material/Box";
import Map from "src/pages/Home/Map";
import PlacesList from "./PlacesList";

const Home: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ height: "calc(100vh - 65px)" }}
    >
      <Box sx={{ width: "400px", overflow: "auto" }}>
        <PlacesList />
      </Box>
      <Map />
    </Box>
  );
};

export default Home;
