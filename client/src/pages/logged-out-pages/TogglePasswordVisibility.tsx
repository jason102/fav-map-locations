import React from "react";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface Props {
  showPassword: boolean;
  onClick: () => void;
}

const TogglePasswordVisibility: React.FC<Props> = ({
  showPassword,
  onClick,
}) => (
  <InputAdornment position="end">
    <IconButton aria-label="toggle password visibility" onClick={onClick}>
      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
    </IconButton>
  </InputAdornment>
);

export default TogglePasswordVisibility;
