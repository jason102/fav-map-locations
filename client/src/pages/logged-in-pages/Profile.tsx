import React from "react";
import { useGetUserDetailsQuery } from "src/app/api/apiSlice";
import { useAppSelector } from "src/app/store";

const Profile: React.FC = () => {
  const userToken = useAppSelector((state) => state.auth.userToken);

  const { data, error, isLoading, isFetching } = useGetUserDetailsQuery(
    userToken!.username
  );
  console.log({ data, error });
  return "Profile page";
};

export default Profile;
