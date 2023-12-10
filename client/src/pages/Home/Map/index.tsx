import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Map: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoadingPlace = useAppSelector((state) => state.location.isLoading);
  const selectedPlace = useAppSelector((state) => state.location.selectedPlace);

  const navigate = useNavigate();

  const [popupLatLng, setPopupLatLng] = useState(new LatLng(0, 0));

  const onRightClickLongPress = async ({ latlng }: LeafletMouseEvent) => {
    setPopupLatLng(latlng);
    await dispatch(reverseGeocode(latlng));
  };

  const onPopupButtonClick = () => {
    if (selectedPlace) {
      navigate(`/location/${selectedPlace.id}`);
    }
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
              <Button onClick={onPopupButtonClick}>Details</Button>
            </Box>
          )}
        </Popup>
      )}
      <MapEvents onRightClickLongPress={onRightClickLongPress} />
    </MapContainer>
  );
};

export default Map;
