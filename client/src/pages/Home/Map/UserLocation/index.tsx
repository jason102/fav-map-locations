import React, { useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useAppDispatch, useAppSelector } from "src/app/store";

import { setUserLocation } from "src/pages/Home/Map/UserLocation/userLocationSlice";

const FLY_TO_ZOOM = 13;

const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

const LocationMarker: React.FC = () => {
  const dispatch = useAppDispatch();
  const userLocation = useAppSelector(
    (state) => state.userLocation.userLocation
  );

  const map = useMap();

  useEffect(() => {
    if (!userLocation) {
      map.locate().on("locationfound", ({ latlng }) => {
        map.flyTo(latlng, FLY_TO_ZOOM);

        dispatch(setUserLocation({ lat: latlng.lat, lng: latlng.lng }));
      });
    }
  }, [map, userLocation, dispatch]);

  return userLocation === null ? null : (
    <Marker position={userLocation} icon={markerIcon} />
  );
};

export default LocationMarker;
