import React from "react";
import { useGetUserDetailsQuery } from "src/app/api/user";
import { useAppSelector } from "src/app/store";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import PageHeader from "src/components/PageHeader";
import { UserToken } from "src/app/api/auth/types";

const Profile: React.FC = () => {
  const { username: urlPathUsername } = useParams();

  const { username } = useAppSelector(
    (state) => state.auth.userToken
  ) as UserToken;

  useGetUserDetailsQuery(urlPathUsername!);

  const isCurrentUser = urlPathUsername === username;

  return (
    <Container component="main" disableGutters>
      <PageHeader
        title={
          isCurrentUser
            ? `My Profile (${username})`
            : `User: ${urlPathUsername}`
        }
      />
      <Box display="flex" justifyContent="center" pt={15}>
        <Typography variant="h6">User profile page - coming soon!</Typography>
      </Box>
    </Container>
  );
};

export default Profile;
