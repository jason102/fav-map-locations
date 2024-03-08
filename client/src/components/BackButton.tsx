import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const { key } = useLocation();

  const onBack = () => {
    navigate(-1);
  };

  const showButton = key !== "default";

  if (showButton) {
    return (
      <IconButton onClick={onBack}>
        <ArrowBackIcon fontSize="medium" />
      </IconButton>
    );
  }

  return null;
};

export default BackButton;
