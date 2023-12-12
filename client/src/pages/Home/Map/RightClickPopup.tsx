import React, { useState } from "react";

import { useForm, SubmitHandler } from "react-hook-form";
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

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FavNewPlaceValues } from "./types";

const RightClickPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoadingPlace = useAppSelector((state) => state.location.isLoading);
  const selectedPlace = useAppSelector((state) => state.location.selectedPlace);

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
    const placeToDispatch = !selectedPlace!.name
      ? { ...selectedPlace!, name: formValues.placeName.trim() }
      : selectedPlace!;

    const fetchResult = await dispatchFavoritePlace(placeToDispatch);

    if (fetchResult.type !== FetchResultType.success) {
      dispatch(openSnackbarWithFetchResult(fetchResult));
    }

    resetForm();
  };

  return (
    <>
      {selectedPlace && popupLatLng && (
        <Popup position={popupLatLng}>
          {isLoadingPlace ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress size={18} color="inherit" />
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onFavoritePlace)}>
              <Box display="flex" flexDirection="column">
                {selectedPlace.name ? (
                  <Typography textAlign="center">
                    <b>{selectedPlace.name}</b>
                  </Typography>
                ) : (
                  <RHFTextField
                    required
                    id="placeName"
                    name="placeName"
                    label="Enter a place name (required)"
                    fullWidth
                    variant="standard"
                    control={control}
                    maxLength={{
                      value: 255,
                      message: "Name cannot exceed 255 characters",
                    }}
                  />
                )}
                <Typography variant="body2">{selectedPlace.address}</Typography>
                <Button type="submit" endIcon={<FavoriteIcon />}>
                  Favorite Me!
                </Button>
              </Box>
            </form>
          )}
        </Popup>
      )}
    </>
  );
};

export default RightClickPopup;
