import React from "react";
import { useGetUserDetailsQuery } from "src/app/api";
import { useAppSelector } from "src/app/store";

const Profile: React.FC = () => {
  const userToken = useAppSelector((state) => state.auth.userToken);

  const { data, error, isLoading, isFetching } = useGetUserDetailsQuery(
    userToken!.username
  );
  console.log({ data, error, isLoading, isFetching });
  return "Profile page";
};

export default Profile;
