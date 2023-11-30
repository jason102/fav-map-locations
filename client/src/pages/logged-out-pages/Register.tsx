import React, { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link as RRDLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/store";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import RHFTextField from "src/components/RHFTextField";
import { RegisterFormValues } from "src/types";
import register from "src/app/api/auth/registerThunk";
import {
  FetchResult,
  FetchResultType,
  setFetchResult,
  setIsSnackbarOpen,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { validateEmail, validatePassword } from "src/utils";
import TogglePasswordVisibility from "./TogglePasswordVisibility";

interface PasswordRequirementProps {
  label: string;
}

const PasswordRequirement: React.FC<PasswordRequirementProps> = ({ label }) => (
  <Grid item xs={12} sm={6}>
    <FormControlLabel
      control={<Checkbox checked size="small" />}
      label={label}
      componentsProps={{ typography: { variant: "subtitle2" } }}
    />
  </Grid>
);

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, watch } = useForm<RegisterFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repeatedPassword: "",
    },
  });

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit: SubmitHandler<RegisterFormValues> = async (
    registerFormValues
  ) => {
    const {
      meta: { requestStatus },
      payload,
    } = await dispatch(register(registerFormValues));

    if (requestStatus === "fulfilled") {
      dispatch(
        setFetchResult({
          message: "Welcome to Favorite Map Locations!",
          type: FetchResultType.success,
        })
      );
    }

    if (requestStatus === "rejected") {
      const fetchResult = payload as FetchResult;
      dispatch(setFetchResult(fetchResult));
    }

    dispatch(setIsSnackbarOpen(true));
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="elevation"
        elevation={16}
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography component="h6" variant="h4" align="center">
            Sign up
          </Typography>
          <Grid container spacing={3} sx={{ pt: 5 }}>
            <Grid item xs={12}>
              <RHFTextField
                required
                id="username"
                name="username"
                label="Username"
                fullWidth
                variant="standard"
                control={control}
                maxLength={{
                  value: 255,
                  message: "Username cannot exceed 255 characters",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                required
                id="email"
                name="email"
                label="Email"
                fullWidth
                autoComplete="email"
                variant="standard"
                control={control}
                validate={(value) =>
                  (validateEmail(value) && value.length <= 255) ||
                  "Please enter a valid email address"
                }
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                required
                id="password"
                name="password"
                label="Password"
                fullWidth
                variant="standard"
                control={control}
                validate={(value) =>
                  (validatePassword(value) && value.length <= 255) ||
                  "Please enter a valid password"
                }
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <TogglePasswordVisibility
                      showPassword={showPassword}
                      onClick={() =>
                        setShowPassword((previousValue) => !previousValue)
                      }
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                required
                id="repeatedPassword"
                name="repeatedPassword"
                label="Repeat password"
                fullWidth
                variant="standard"
                control={control}
                validate={(value) =>
                  value === password.current || "The passwords do not match"
                }
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <TogglePasswordVisibility
                      showPassword={showPassword}
                      onClick={() =>
                        setShowPassword((previousValue) => !previousValue)
                      }
                    />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    Password requirements:
                  </Typography>
                </Grid>
                <PasswordRequirement label="1 uppercase letter" />
                <PasswordRequirement label="1 symbol" />
                <PasswordRequirement label="1 lowercase letter" />
                <PasswordRequirement label="At least 8 characters long" />
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              {...(isLoading && { sx: { width: "88px", height: "36px" } })}
            >
              {isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
      <Typography variant="inherit" align="center">
        {`Already have an account? `}
        <Link component={RRDLink} to="/login">
          Log in
        </Link>
      </Typography>
    </Container>
  );
};

export default Register;
