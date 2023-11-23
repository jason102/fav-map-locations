import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./index.css";
import { useAppSelector } from "src/app/store";

import RightClickPopup from "./RightClickPopup";
import NearbyPlacesMarkers from "./NearbyPlacesMarkers";
import UserLocation from "./UserLocation";

const Map: React.FC = () => {
  const currentCenter = useAppSelector(
    (state) => state.userLocation.currentCenter
  );
  const currentZoom = useAppSelector((state) => state.userLocation.currentZoom);

  return (
    <MapContainer
      center={currentCenter}
      zoom={currentZoom}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserLocation />
      <NearbyPlacesMarkers />
      <RightClickPopup />
    </MapContainer>
  );
};

export default Map;
