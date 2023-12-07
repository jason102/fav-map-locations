import React, { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "src/app/store";
import { clearSelectedGooglePlace } from "src/pages/logged-in-pages/Location/locationSlice";
import { LocationLoaderData } from "./types";

const Location: React.FC = () => {
  const { googlePlaceID } = useLoaderData() as LocationLoaderData;

  const dispatch = useAppDispatch();
  const place = useAppSelector((state) => state.location.selectedGooglePlace);
  const isLoadingGooglePlace = useAppSelector(
    (state) => state.location.isLoading
  );

  // Reset the selected place to null when the user leaves this page so other places
  // can be loaded correctly for subsequent page loads
  useEffect(
    () => () => {
      dispatch(clearSelectedGooglePlace());
    },
    []
  );

  return "Location details page";
};

export default Location;
