import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./index.css";
import MapEvents from "./MapEvents";
import { useAppSelector } from "src/app/store";

const Map: React.FC = () => {
  const isLoadingPlace = useAppSelector((state) => state.location.isLoading);
  const place = useAppSelector((state) => state.location.osmPlace);
  console.log({ place });
  // TODO: Change the position to be based on the user's location?
  const position = { lat: 37.65516454947692, lng: -122.49232708106909 };

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          {isLoadingPlace ? (
            <div>Loading...</div>
          ) : (
            <div>{place?.display_name}</div>
          )}
        </Popup>
      </Marker>
      <MapEvents />
    </MapContainer>
  );
};

export default Map;
