import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./index.css";

import RightClickPopup from "./RightClickPopup";
import NearbyPlacesMarkers from "./NearbyPlacesMarkers";
import UserLocation from "./UserLocation";

const Map: React.FC = () => {
  // TODO: Change the position to be based on the user's location?
  const position = { lat: 37.65516454947692, lng: -122.49232708106909 };

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
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
