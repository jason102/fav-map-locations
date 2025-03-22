import React, { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link as RRDLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/store";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import RHFTextField from "src/components/RHFTextField";
import register from "src/app/api/auth/registerThunk";
import {
  FetchResult,
  FetchResultType,
  openSnackbarWithFetchResult,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import { MAX_INPUT_TEXT_LENGTH } from "src/utils";
import TogglePasswordVisibility from "./TogglePasswordVisibility";
import LoadingButton from "src/components/LoadingButton";
import { RegisterFormValues } from "./types";

const PasswordRegex = {
  uppercase: /(?=.*[A-Z])/,
  lowercase: /(?=.*[a-z])/,
  symbol: /(?=.*\W)/,
  minChars: /.{8,}/,
  minNumbers: /(?=.*\d)/,
};

interface PasswordRequirementProps {
  label: string;
  type: RegExp;
  password: string;
}

const PasswordRequirement: React.FC<PasswordRequirementProps> = ({
  label,
  type,
  password,
}) => (
  <Grid item xs={12} sm={6}>
    <FormControlLabel
      control={<Checkbox checked={type.test(password)} size="small" />}
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

  const password = useRef("");
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
        openSnackbarWithFetchResult({
          message: "Welcome to Favorite Map Locations!",
          type: FetchResultType.success,
        })
      );
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
                  value: MAX_INPUT_TEXT_LENGTH,
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
                  (isEmail(value) && value.length <= MAX_INPUT_TEXT_LENGTH) ||
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
                  (isStrongPassword(value, {
                    minLength: 8,
                    minUppercase: 1,
                    minLowercase: 1,
                    minSymbols: 1,
                    minNumbers: 1,
                  }) &&
                    value.length <= MAX_INPUT_TEXT_LENGTH) ||
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
                <PasswordRequirement
                  label="1 uppercase letter"
                  type={PasswordRegex.uppercase}
                  password={password.current}
                />
                <PasswordRequirement
                  label="1 symbol"
                  type={PasswordRegex.symbol}
                  password={password.current}
                />
                <PasswordRequirement
                  label="1 lowercase letter"
                  type={PasswordRegex.lowercase}
                  password={password.current}
                />
                <PasswordRequirement
                  label="1 number"
                  type={PasswordRegex.minNumbers}
                  password={password.current}
                />
                <PasswordRequirement
                  label="At least 8 characters long"
                  type={PasswordRegex.minChars}
                  password={password.current}
                />
              </Grid>
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
        {`Already have an account? `}
        <Link component={RRDLink} to="/login">
          Log in
        </Link>
      </Typography>
    </Container>
  );
};

export default Register;
