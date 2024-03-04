import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link as RRDLink, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/store";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import RHFTextField from "src/components/RHFTextField";
import { LoginFormValues } from "./types";
import login from "src/app/api/auth/loginThunk";
import {
  FetchResult,
  FetchResultType,
  openSnackbarWithFetchResult,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import TogglePasswordVisibility from "src/pages/logged-out-pages/TogglePasswordVisibility";
import LoadingButton from "src/components/LoadingButton";
import { MAX_INPUT_TEXT_LENGTH } from "src/utils";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (loginFormValues) => {
    const {
      meta: { requestStatus },
      payload,
    } = await dispatch(login(loginFormValues));

    if (requestStatus === "fulfilled") {
      dispatch(
        openSnackbarWithFetchResult({
          message: "Logged in successfully!",
          type: FetchResultType.success,
        })
      );

      if (locationState?.fromPath) {
        navigate(locationState.fromPath, {
          replace: true,
        });
      }
    }

    if (requestStatus === "rejected") {
      const fetchResult = payload as FetchResult;
      dispatch(openSnackbarWithFetchResult(fetchResult));
    }
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
            Sign in
          </Typography>
          <Grid container spacing={3} sx={{ pt: 5 }}>
            <Grid item xs={12}>
              <RHFTextField
                required
                id="username"
                name="usernameOrEmail"
                label="Username or email"
                fullWidth
                autoComplete="username"
                variant="standard"
                control={control}
                maxLength={{
                  value: MAX_INPUT_TEXT_LENGTH,
                  message: "Username cannot exceed 255 characters",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                required
                id="password"
                name="password"
                label="Password"
                fullWidth
                autoComplete="current-password"
                variant="standard"
                control={control}
                maxLength={{
                  value: MAX_INPUT_TEXT_LENGTH,
                  message: "Password cannot exceed 255 characters",
                }}
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
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <LoadingButton isLoading={isLoading} type="submit">
              Submit
            </LoadingButton>
          </Box>
        </form>
      </Paper>
      <Typography variant="inherit" align="center">
        {`Don't yet have an account? `}
        <Link component={RRDLink} to="/register">
          Register
        </Link>
      </Typography>
    </Container>
  );
};

export default Login;
