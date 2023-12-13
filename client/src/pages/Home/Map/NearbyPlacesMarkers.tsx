import React, { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { Link as RRDLink } from "react-router-dom";
import { Marker, useMap, Popup } from "react-leaflet";
import L, { LatLng } from "leaflet";
import "./marker.css";

import { useGetPlacesNearbyQuery } from "src/app/api";
import { useAppDispatch, useAppSelector } from "src/app/store";
import {
  setMapCenter,
  setSelectedPlace,
} from "src/pages/logged-in-pages/Location/locationSlice";
import { Place } from "src/pages/logged-in-pages/Location/types";
import { useOpenSelectedPopup } from "./useOpenSelectedPopup";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaceIcon from "@mui/icons-material/Place";

const NearbyPlacesMarkers: React.FC = () => {
  const dispatch = useAppDispatch();

  const selectedPlace = useAppSelector((state) => state.location.selectedPlace);

  const mapCenter = useAppSelector((state) => state.location.mapCenter);
  const { data: places } = useGetPlacesNearbyQuery(mapCenter!, {
    skip: !mapCenter,
  });

  const map = useMap();
  const popupRefs = useOpenSelectedPopup(places);

  const loadPlaces = () => {
    const { lat, lng } = map.getCenter();
    dispatch(setMapCenter({ lat, lng }));
  };

  useEffect(() => {
    if (map) {
      loadPlaces();
    }
  }, [map]);

  // useMapEvent("moveend", loadPlaces);

  const onMarkerClick = (place: Place) => {
    dispatch(setSelectedPlace(place));
  };

  if (places) {
    return (
      <>
        {places.map((place) => {
          const markerIcon = L.divIcon({
            iconSize: [45, 61],
            iconAnchor: [23, 45],
            popupAnchor: [2, -40],
            className: "place-icon",
            html: `<div class="${
              place.id === selectedPlace?.id
                ? "place-icon-selected"
                : "place-icon-not-selected"
            }">${ReactDOMServer.renderToString(
              <PlaceIcon fontSize="large" />
            )}</div>`,
          });

          return (
            <Marker
              key={place.id}
              position={new LatLng(place.lat, place.lng)}
              icon={markerIcon}
              eventHandlers={{
                click: () => onMarkerClick(place),
              }}
            >
              <Popup
                position={new LatLng(place.lat, place.lng)}
                ref={popupRefs[place.id]}
              >
                <Box display="flex" flexDirection="column">
                  <Typography textAlign="center">
                    <b>{place.name}</b>
                  </Typography>
                  <Typography variant="body2">{place.address}</Typography>
                  <Box display="flex" flexDirection="row">
                    <Box flex={1}>
                      <Button component={RRDLink} to={`/location/${place.id}`}>
                        Details
                      </Button>
                    </Box>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </>
    );
  }

  return null;
};

export default NearbyPlacesMarkers;
