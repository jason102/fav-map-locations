import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface Props {
  title: string;
}

const PageHeader: React.FC<Props> = ({ title }) => {
  const navigate = useNavigate();
  const { key } = useLocation();

  const onBack = () => {
    navigate(-1);
  };

  const showButton = key !== "default";

  return (
    <Box sx={{ display: "flex", flex: 1, py: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 60,
        }}
      >
        {showButton && (
          <IconButton onClick={onBack}>
            <ArrowBackIcon fontSize="medium" />
          </IconButton>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Typography variant="h6" textAlign="center">
          {title}
        </Typography>
      </Box>
      <Box sx={{ width: 60 }} />
    </Box>
  );
};

export default PageHeader;
