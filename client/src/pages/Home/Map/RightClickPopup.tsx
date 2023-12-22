import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link as RRDLink } from "react-router-dom";
import { Popup, useMapEvent } from "react-leaflet";
import { LeafletMouseEvent, LatLng } from "leaflet";
import "./index.css";
import { useAppDispatch, useAppSelector } from "src/app/store";

import reverseGeocode from "src/pages/logged-in-pages/Location/reverseGeocode";
import { useFavoritePlaceMutation } from "src/app/api";
import { useSnackbarFetchResponse } from "src/components/FetchResultSnackbar/snackbarFetchResponseHandling";
import { Place } from "src/pages/logged-in-pages/Location/types";
import {
  FetchResultType,
  openSnackbarWithFetchResult,
} from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";
import RHFTextField from "src/components/RHFTextField";
import { FavNewPlaceValues } from "./types";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";

const RightClickPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoadingPlace = useAppSelector((state) => state.location.isLoading);
  const rightClickedPlace = useAppSelector(
    (state) => state.location.rightClickedPlace
  );
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<FavNewPlaceValues>({
    defaultValues: {
      placeName: "",
    },
  });

  const [popupLatLng, setPopupLatLng] = useState<LatLng | null>(null);

  const [dispatchFavoritePlace] = useSnackbarFetchResponse<Place>(
    useFavoritePlaceMutation()
  );

  // contextmenu() can be used for right clicks and long-presses
  useMapEvent("contextmenu", async ({ latlng }: LeafletMouseEvent) => {
    setPopupLatLng(latlng);
    await dispatch(reverseGeocode(latlng));
  });

  const onFavoritePlace: SubmitHandler<FavNewPlaceValues> = async (
    formValues
  ) => {
    const placeToDispatch = !rightClickedPlace!.name
      ? { ...rightClickedPlace!, name: formValues.placeName.trim() }
      : rightClickedPlace!;

    const fetchResult = await dispatchFavoritePlace(placeToDispatch);

    if (fetchResult.type !== FetchResultType.success) {
      dispatch(openSnackbarWithFetchResult(fetchResult));
    }

    resetForm();
    setPopupLatLng(null);
  };

  if (rightClickedPlace && popupLatLng) {
    return (
      <Popup position={popupLatLng}>
        {isLoadingPlace ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress size={18} color="inherit" />
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onFavoritePlace)}>
            <Box display="flex" flexDirection="column">
              {rightClickedPlace.name ? (
                <Typography textAlign="center">
                  <b>{rightClickedPlace.name}</b>
                </Typography>
              ) : (
                <RHFTextField
                  required
                  id="placeName"
                  name="placeName"
                  label={
                    accessToken
                      ? "Enter a place name (required)"
                      : "Log in to favorite place"
                  }
                  fullWidth
                  variant="standard"
                  control={control}
                  disabled={!accessToken}
                  maxLength={{
                    value: 255,
                    message: "Name cannot exceed 255 characters",
                  }}
                />
              )}
              <Typography variant="body2">
                {rightClickedPlace.address}
              </Typography>
              {accessToken ? (
                <Button type="submit" endIcon={<FavoriteIcon />}>
                  Favorite Me!
                </Button>
              ) : (
                <Button component={RRDLink} to={`login`}>
                  Log in to favorite place!
                </Button>
              )}
            </Box>
          </form>
        )}
      </Popup>
    );
  }

  return null;
};

export default RightClickPopup;
