import React, { useState } from "react";
import { Link as RRDLink } from "react-router-dom";
import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { LeafletMouseEvent, LatLng } from "leaflet";
import "./index.css";
import { useAppDispatch, useAppSelector } from "src/app/store";
import MapEvents from "./MapEvents";
import reverseGeocode from "src/pages/logged-in-pages/Location/reverseGeocode";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFavoritePlaceMutation } from "src/app/api";
import { useSnackbarFetchResponse } from "src/components/FetchResultSnackbar/snackbarFetchResponseHandling";
import { Place } from "src/pages/logged-in-pages/Location/types";
import { openSnackbarWithFetchResult } from "src/components/FetchResultSnackbar/fetchResultSnackbarSlice";

const Map: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoadingPlace = useAppSelector((state) => state.location.isLoading);
  const selectedPlace = useAppSelector((state) => state.location.selectedPlace);

  const [dispatchFavoritePlace] = useSnackbarFetchResponse<Place>(
    useFavoritePlaceMutation(),
    {}
  );

  const [popupLatLng, setPopupLatLng] = useState(new LatLng(0, 0));

  const onRightClickLongPress = async ({ latlng }: LeafletMouseEvent) => {
    setPopupLatLng(latlng);
    await dispatch(reverseGeocode(latlng));
  };

  const onFavoritePlace = async () => {
    const fetchResult = await dispatchFavoritePlace(selectedPlace!);
    dispatch(openSnackbarWithFetchResult(fetchResult));
  };

  // TODO: Change the position to be based on the user's location?
  const position = { lat: 37.65516454947692, lng: -122.49232708106909 };

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {selectedPlace && (
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
      <MapEvents onRightClickLongPress={onRightClickLongPress} />
    </MapContainer>
  );
};

export default Map;
