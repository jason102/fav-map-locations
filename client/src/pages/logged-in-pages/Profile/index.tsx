import React from "react";
import { useGetUserDetailsQuery } from "src/app/api/user";
import { useAppSelector } from "src/app/store";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Profile: React.FC = () => {
  const userToken = useAppSelector((state) => state.auth.userToken);

  useGetUserDetailsQuery(userToken!.username);

  return (
    <Box display="flex" justifyContent="center" pt={15}>
      <Typography variant="h6">User profile page - coming soon!</Typography>
    </Box>
  );
};

export default Profile;
