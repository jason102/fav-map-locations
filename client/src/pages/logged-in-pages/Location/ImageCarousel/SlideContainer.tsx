import React from "react";
import Box from "@mui/material/Box";

interface Props {
  children: React.ReactNode;
}

const SlideContainer: React.FC<Props> = ({ children }) => (
  <Box
    sx={{
      height: "400px",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        height: "400px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  </Box>
);

export default SlideContainer;
