import React, { ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  isLoading: boolean;
  children: ReactNode;
}

// For typing it correctly:
// https://stackoverflow.com/questions/46152782/how-to-extend-props-for-material-ui-components-using-typescript
const LoadingButton = <C extends React.ElementType>(
  props: ButtonProps<C, { component?: C }> & Props
) => {
  const { isLoading, children, ...rest } = props;
  return (
    <Button
      variant="contained"
      sx={{ my: 1, mx: 1.5 }}
      disabled={isLoading}
      {...(isLoading && { sx: { width: "88px", height: "36px" } })}
      {...rest}
    >
      {isLoading ? <CircularProgress size={18} color="inherit" /> : children}
    </Button>
  );
};

export default LoadingButton;
