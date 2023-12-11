import React, { useState } from "react";
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

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";

const RightClickPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoadingPlace = useAppSelector((state) => state.location.isLoading);
  const selectedPlace = useAppSelector((state) => state.location.selectedPlace);

  const [popupLatLng, setPopupLatLng] = useState<LatLng | null>(null);

  const [dispatchFavoritePlace] = useSnackbarFetchResponse<Place>(
    useFavoritePlaceMutation()
  );

  // contextmenu() can be used for right clicks and long-presses
  useMapEvent("contextmenu", async ({ latlng }: LeafletMouseEvent) => {
    setPopupLatLng(latlng);
    await dispatch(reverseGeocode(latlng));
  });

  const onFavoritePlace = async () => {
    const fetchResult = await dispatchFavoritePlace(selectedPlace!);

    if (fetchResult.type !== FetchResultType.success) {
      dispatch(openSnackbarWithFetchResult(fetchResult));
    }
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
            <Box display="flex" flexDirection="column">
              {selectedPlace.name && (
                <Typography textAlign="center">
                  <b>{selectedPlace.name}</b>
                </Typography>
              )}
              <Typography variant="body2">{selectedPlace.address}</Typography>
              {selectedPlace.isFavorited ? (
                <Box display="flex" flexDirection="row">
                  <Box flex={1}>
                    <Button
                      component={RRDLink}
                      to={`/location/${selectedPlace.id}`}
                    >
                      Details
                    </Button>
                  </Box>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Button onClick={onFavoritePlace} endIcon={<FavoriteIcon />}>
                  Favorite Me!
                </Button>
              )}
            </Box>
          )}
        </Popup>
      )}
    </>
  );
};

export default RightClickPopup;
